// ======================================================
// PenguinLogic HSE Dashboard
// app.js
// ======================================================


// ======================================================
// DOM ELEMENTS
// ======================================================

const form =
  document.getElementById(
    "nearMissForm"
  );

const likelihoodInput =
  document.getElementById(
    "likelihood"
  );

const severityInput =
  document.getElementById(
    "severity"
  );

const riskScoreDisplay =
  document.getElementById(
    "riskScore"
  );

const riskLevelDisplay =
  document.getElementById(
    "riskLevel"
  );

const searchInput =
  document.getElementById(
    "searchInput"
  );

const riskFilter =
  document.getElementById(
    "riskFilter"
  );

const areaFilter =
  document.getElementById(
    "areaFilter"
  );

const recordsTable =
  document.getElementById(
    "recordsTable"
  );

const evidenceInput =
  document.getElementById(
    "evidence"
  );


const toast =
  document.getElementById(
    "toast"
  );

const toastMessage =
  document.getElementById(
    "toastMessage"
  );


const confirmModal =
  document.getElementById(
    "confirmModal"
  );

const confirmTitle =
  document.getElementById(
    "confirmTitle"
  );

const confirmMessage =
  document.getElementById(
    "confirmMessage"
  );

const confirmCancel =
  document.getElementById(
    "confirmCancel"
  );

const confirmOk =
  document.getElementById(
    "confirmOk"
  );


const reportModal =
  document.getElementById(
    "reportModal"
  );

const reportClose =
  document.getElementById(
    "reportClose"
  );

const reportPrint =
  document.getElementById(
    "reportPrint"
  );

const reportNumber =
  document.getElementById(
    "reportNumber"
  );

const reportDate =
  document.getElementById(
    "reportDate"
  );

const reportArea =
  document.getElementById(
    "reportArea"
  );

const reportHazard =
  document.getElementById(
    "reportHazard"
  );

const reportLikelihood =
  document.getElementById(
    "reportLikelihood"
  );

const reportSeverity =
  document.getElementById(
    "reportSeverity"
  );

const reportRiskScore =
  document.getElementById(
    "reportRiskScore"
  );

const reportRiskLevel =
  document.getElementById(
    "reportRiskLevel"
  );

const reportDescription =
  document.getElementById(
    "reportDescription"
  );

const reportConsequence =
  document.getElementById(
    "reportConsequence"
  );

const reportAction =
  document.getElementById(
    "reportAction"
  );

const reportEvidenceName =
  document.getElementById(
    "reportEvidenceName"
  );

const reportEvidencePreview =
  document.getElementById(
    "reportEvidencePreview"
  );

const reportCreatedAt =
  document.getElementById(
    "reportCreatedAt"
  );


// ======================================================
// LOCAL STATE
// ======================================================

let allRecordsCache =
  new Map();

let currentReportRecord =
  null;

let currentReportEvidenceURL =
  null;

let reportReturnFocusElement =
  null;

let reportHistoryActive =
  false;


// ======================================================
// HELPERS
// ======================================================

function escapeHTML(
  value
) {

  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


function formatRecordDate(
  value
) {

  if (!value) {

    return "-";

  }


  const parts =
    String(
      value
    ).split("-");


  if (
    parts.length !==
    3
  ) {

    return String(
      value
    );

  }


  const year =
    Number(
      parts[0]
    );

  const month =
    Number(
      parts[1]
    );

  const day =
    Number(
      parts[2]
    );


  const date =
    new Date(
      year,
      month - 1,
      day
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return String(
      value
    );

  }


  return date
    .toLocaleDateString(
      "en-GB",
      {
        day:
          "2-digit",

        month:
          "long",

        year:
          "numeric"
      }
    );

}


function formatDateTime(
  value
) {

  if (!value) {

    return "-";

  }


  const date =
    new Date(
      value
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return String(
      value
    );

  }


  return date
    .toLocaleString(
      "en-GB",
      {
        day:
          "2-digit",

        month:
          "long",

        year:
          "numeric",

        hour:
          "2-digit",

        minute:
          "2-digit"
      }
    );

}


function generateReportNumber(
  record
) {

  const date =
    String(
      record.date ||
      ""
    )
      .replaceAll(
        "-",
        ""
      );


  const safeDate =
    date.length ===
    8

      ? date

      : "00000000";


  const id =
    String(
      Number(
        record.id
      ) ||
      0
    )
      .padStart(
        4,
        "0"
      );


  return (
    `NM-${safeDate}-${id}`
  );

}


function getLikelihoodLabel(
  value
) {

  const labels = {

    1:
      "1 - Rare",

    2:
      "2 - Unlikely",

    3:
      "3 - Possible",

    4:
      "4 - Likely",

    5:
      "5 - Almost Certain"

  };


  return (

    labels[
      Number(
        value
      )
    ] ||

    String(
      value ||
      "-"
    )

  );

}


function getSeverityLabel(
  value
) {

  const labels = {

    1:
      "1 - Insignificant",

    2:
      "2 - Minor",

    3:
      "3 - Moderate",

    4:
      "4 - Major",

    5:
      "5 - Catastrophic"

  };


  return (

    labels[
      Number(
        value
      )
    ] ||

    String(
      value ||
      "-"
    )

  );

}


function isImageEvidence(
  record
) {

  if (
    !record ||
    !record.evidenceFile
  ) {

    return false;

  }


  const type =
    String(

      record.evidenceType ||

      record
        .evidenceFile
        .type ||

      ""

    ).toLowerCase();


  const name =
    String(
      record.evidenceName ||
      ""
    )
      .toLowerCase();


  return (

    type.startsWith(
      "image/"
    ) ||

    /\.(jpg|jpeg|png|webp|gif|heic|heif)$/i
      .test(
        name
      )

  );

}


function isPDFEvidence(
  record
) {

  if (
    !record ||
    !record.evidenceFile
  ) {

    return false;

  }


  const type =
    String(

      record.evidenceType ||

      record
        .evidenceFile
        .type ||

      ""

    ).toLowerCase();


  const name =
    String(
      record.evidenceName ||
      ""
    )
      .toLowerCase();


  return (

    type ===
      "application/pdf" ||

    /\.pdf$/i
      .test(
        name
      )

  );

}


// ======================================================
// TOAST
// ======================================================

function showToast(
  message,
  type = "info"
) {

  if (
    !toast ||
    !toastMessage
  ) {

    console.log(
      message
    );

    return;

  }


  toastMessage
    .textContent =
      message;


  toast
    .className =
      `toast toast-${type}`;


  clearTimeout(
    showToast._timeout
  );


  showToast._timeout =
    setTimeout(

      () => {

        toast
          .classList
          .add(
            "hidden"
          );

      },

      2500

    );

}


// ======================================================
// CUSTOM CONFIRMATION MODAL
// ======================================================

function showConfirm(
  title,
  message,
  okText = "OK"
) {

  return new Promise(

    resolve => {

      if (
        !confirmModal ||
        !confirmTitle ||
        !confirmMessage ||
        !confirmCancel ||
        !confirmOk
      ) {

        resolve(
          window.confirm(
            message
          )
        );

        return;

      }


      const previousFocus =
        document.activeElement;


      confirmTitle
        .textContent =
          title;


      confirmMessage
        .textContent =
          message;


      confirmOk
        .textContent =
          okText;


      confirmModal
        .classList
        .remove(
          "hidden"
        );


      setTimeout(
        () => {

          confirmCancel
            .focus();

        },
        0
      );


      function cleanup(
        result
      ) {

        confirmModal
          .classList
          .add(
            "hidden"
          );


        confirmCancel
          .removeEventListener(
            "click",
            onCancel
          );


        confirmOk
          .removeEventListener(
            "click",
            onConfirm
          );


        confirmModal
          .removeEventListener(
            "click",
            onBackdrop
          );


        document
          .removeEventListener(
            "keydown",
            onKeyDown
          );


        if (
          previousFocus &&
          typeof previousFocus.focus ===
            "function"
        ) {

          previousFocus
            .focus();

        }


        resolve(
          result
        );

      }


      function onCancel() {

        cleanup(
          false
        );

      }


      function onConfirm() {

        cleanup(
          true
        );

      }


      function onBackdrop(
        event
      ) {

        if (
          event.target ===
          confirmModal
        ) {

          cleanup(
            false
          );

        }

      }


      function onKeyDown(
        event
      ) {

        if (
          event.key ===
          "Escape"
        ) {

          cleanup(
            false
          );

        }

      }


      confirmCancel
        .addEventListener(
          "click",
          onCancel
        );


      confirmOk
        .addEventListener(
          "click",
          onConfirm
        );


      confirmModal
        .addEventListener(
          "click",
          onBackdrop
        );


      document
        .addEventListener(
          "keydown",
          onKeyDown
        );

    }

  );

}


// ======================================================
// RISK LOGIC
// ======================================================

function calculateRiskLevel(
  score
) {

  if (
    score <=
    4
  ) {

    return {

      level:
        "Low",

      className:
        "risk-low"

    };

  }


  if (
    score <=
    9
  ) {

    return {

      level:
        "Medium",

      className:
        "risk-medium"

    };

  }


  if (
    score <=
    16
  ) {

    return {

      level:
        "High",

      className:
        "risk-high"

    };

  }


  return {

    level:
      "Critical",

    className:
      "risk-critical"

  };

}


function getRiskClass(
  level
) {

  switch (
    level
  ) {

    case "Low":

      return (
        "risk-low"
      );


    case "Medium":

      return (
        "risk-medium"
      );


    case "High":

      return (
        "risk-high"
      );


    case "Critical":

      return (
        "risk-critical"
      );


    default:

      return "";

  }

}


function highlightRiskMatrix(
  likelihood,
  severity
) {

  const allCells =
    Array.from(

      document
        .querySelectorAll(
          ".matrix-cell"
        )

    );


  allCells
    .forEach(

      cell => {

        cell
          .classList
          .remove(
            "active-risk"
          );

      }

    );


  if (
    !likelihood ||
    !severity
  ) {

    return;

  }


  const targetIndex =

    (
      5 -
      likelihood
    ) *

    5 +

    (
      severity -
      1
    );


  const targetCell =
    allCells[
      targetIndex
    ];


  if (
    targetCell
  ) {

    targetCell
      .classList
      .add(
        "active-risk"
      );

  }

}


function updateRiskPreview() {

  if (
    !likelihoodInput ||
    !severityInput ||
    !riskScoreDisplay ||
    !riskLevelDisplay
  ) {

    return;

  }


  const likelihood =
    Number(
      likelihoodInput
        .value
    );


  const severity =
    Number(
      severityInput
        .value
    );


  if (
    !likelihood ||
    !severity
  ) {

    riskScoreDisplay
      .textContent =
        "-";


    riskLevelDisplay
      .textContent =
        "Select likelihood and severity";


    riskLevelDisplay
      .className =
        "risk-level";


    highlightRiskMatrix(
      null,
      null
    );


    return;

  }


  const score =
    likelihood *
    severity;


  const risk =
    calculateRiskLevel(
      score
    );


  riskScoreDisplay
    .textContent =
      score;


  riskLevelDisplay
    .textContent =
      risk.level;


  riskLevelDisplay
    .className =
      `risk-level ${risk.className}`;


  highlightRiskMatrix(
    likelihood,
    severity
  );

}


// ======================================================
// EVIDENCE VALIDATION
// ======================================================

function validateEvidence(
  file
) {

  if (
    !file
  ) {

    return true;

  }


  const maxFileSize =
    10 *
    1024 *
    1024;


  const fileName =
    String(
      file.name ||
      ""
    )
      .toLowerCase();


  const fileType =
    String(
      file.type ||
      ""
    )
      .toLowerCase();


  const allowedImageTypes = [

    "image/jpeg",

    "image/png",

    "image/webp",

    "image/gif",

    "image/heic",

    "image/heif"

  ];


  const isImage =

    allowedImageTypes
      .includes(
        fileType
      ) ||

    /\.(jpg|jpeg|png|webp|gif|heic|heif)$/i
      .test(
        fileName
      );


  const isPDF =

    fileType ===
      "application/pdf" ||

    /\.pdf$/i
      .test(
        fileName
      );


  if (
    !isImage &&
    !isPDF
  ) {

    showToast(

      "Evidence must be an image or PDF file.",

      "error"

    );


    return false;

  }


  if (
    file.size >
    maxFileSize
  ) {

    showToast(

      "Evidence file must not exceed 10 MB.",

      "error"

    );


    return false;

  }


  return true;

}


// ======================================================
// SAVE NEW NEAR-MISS RECORD
// ======================================================

if (
  form
) {

  form
    .addEventListener(

      "submit",

      async (
        event
      ) => {

        event
          .preventDefault();


        const likelihood =
          Number(
            likelihoodInput
              ?.value
          );


        const severity =
          Number(
            severityInput
              ?.value
          );


        if (
          !likelihood ||
          !severity
        ) {

          showToast(

            "Please select likelihood and severity.",

            "error"

          );


          return;

        }


        const evidenceFile =

          evidenceInput
            ?.files
            ?.[0] ||

          null;


        if (
          !validateEvidence(
            evidenceFile
          )
        ) {

          return;

        }


        const riskScore =
          likelihood *
          severity;


        const risk =
          calculateRiskLevel(
            riskScore
          );


        const record = {

          date:

            document
              .getElementById(
                "date"
              )
              ?.value ||

            "",


          area:

            document
              .getElementById(
                "area"
              )
              ?.value ||

            "",


          hazard:

            document
              .getElementById(
                "hazard"
              )
              ?.value ||

            "",


          likelihood,

          severity,

          riskScore,


          riskLevel:
            risk.level,


          description:

            document
              .getElementById(
                "description"
              )
              ?.value
              .trim() ||

            "",


          consequence:

            document
              .getElementById(
                "consequence"
              )
              ?.value
              .trim() ||

            "",


          action:

            document
              .getElementById(
                "action"
              )
              ?.value
              .trim() ||

            "",


          evidenceFile,


          evidenceName:

            evidenceFile

              ? evidenceFile
                  .name

              : null,


          evidenceType:

            evidenceFile

              ? evidenceFile
                  .type

              : null,


          evidenceSize:

            evidenceFile

              ? evidenceFile
                  .size

              : null,


          createdAt:

            new Date()
              .toISOString()

        };


        try {

          const newId =
            await addRecord(
              record
            );


          console.log(

            "Record saved successfully. ID:",

            newId

          );


          showToast(

            "Near-miss record saved.",

            "success"

          );


          form
            .reset();


          setTodayDate();


          updateRiskPreview();


          await loadDashboard();


        } catch (
          error
        ) {

          console.error(

            "Failed to save record:",

            error

          );


          showToast(

            "Failed to save record.",

            "error"

          );

        }

      }

    );

}


// ======================================================
// LOAD + FILTER DASHBOARD
// ======================================================

async function loadDashboard() {

  try {

    const records =
      await getAllRecords();


    allRecordsCache =
      new Map(

        records
          .map(

            record => [

              Number(
                record.id
              ),

              record

            ]

          )

      );


    const searchTerm =
      String(

        searchInput
          ?.value ??

        ""

      )
        .toLowerCase()
        .trim();


    const selectedRisk =

      riskFilter
        ?.value ??

      "";


    const selectedArea =

      areaFilter
        ?.value ??

      "";


    const filteredRecords =

      records
        .filter(

          record => {

            const area =
              String(
                record.area ??
                ""
              )
                .toLowerCase();


            const hazard =
              String(
                record.hazard ??
                ""
              )
                .toLowerCase();


            const description =
              String(
                record.description ??
                ""
              )
                .toLowerCase();


            const consequence =
              String(
                record.consequence ??
                ""
              )
                .toLowerCase();


            const action =
              String(
                record.action ??
                ""
              )
                .toLowerCase();


            const evidenceName =
              String(
                record.evidenceName ??
                ""
              )
                .toLowerCase();


            const matchesSearch =

              !searchTerm ||

              area
                .includes(
                  searchTerm
                ) ||

              hazard
                .includes(
                  searchTerm
                ) ||

              description
                .includes(
                  searchTerm
                ) ||

              consequence
                .includes(
                  searchTerm
                ) ||

              action
                .includes(
                  searchTerm
                ) ||

              evidenceName
                .includes(
                  searchTerm
                );


            const matchesRisk =

              !selectedRisk ||

              record.riskLevel ===
                selectedRisk;


            const matchesArea =

              !selectedArea ||

              record.area ===
                selectedArea;


            return (

              matchesSearch &&

              matchesRisk &&

              matchesArea

            );

          }

        );


    renderRecords(
      filteredRecords
    );


    updateStats(
      records
    );


  } catch (
    error
  ) {

    console.error(

      "Failed to load dashboard:",

      error

    );


    showToast(

      "Unable to load saved records.",

      "error"

    );

  }

}


// ======================================================
// RENDER RECORD TABLE
// ======================================================

function renderRecords(
  records
) {

  if (
    !recordsTable
  ) {

    return;

  }


  if (
    records.length ===
    0
  ) {

    recordsTable
      .innerHTML = `

        <tr>

          <td colspan="8">
            No matching records found.
          </td>

        </tr>

      `;


    return;

  }


  const sortedRecords =

    [
      ...records
    ]
      .sort(

        (
          a,
          b
        ) => {

          const dateComparison =

            String(
              b.date ||
              ""
            )
              .localeCompare(

                String(
                  a.date ||
                  ""
                )

              );


          if (
            dateComparison !==
            0
          ) {

            return (
              dateComparison
            );

          }


          return (

            String(
              b.createdAt ||
              ""
            )
              .localeCompare(

                String(
                  a.createdAt ||
                  ""
                )

              )

          );

        }

      );


  recordsTable
    .innerHTML =

      sortedRecords

        .map(

          record => {

            const id =
              Number(
                record.id
              );


            const date =
              escapeHTML(
                record.date
              );


            const area =
              escapeHTML(
                record.area
              );


            const hazard =
              escapeHTML(
                record.hazard
              );


            const riskScore =
              escapeHTML(
                record.riskScore
              );


            const riskLevel =
              escapeHTML(
                record.riskLevel
              );


            const riskClass =
              getRiskClass(
                record.riskLevel
              );


            const evidenceName =
              escapeHTML(

                record.evidenceName ||

                ""

              );


            const hasEvidence =
              Boolean(
                record.evidenceFile
              );


            const evidenceHTML =

              hasEvidence

                ? `

                  <button
                    type="button"
                    class="evidence-button"
                    onclick="viewEvidence(${id})"
                  >
                    View
                  </button>

                  <div
                    class="evidence-file-name"
                    title="${evidenceName}"
                  >
                    ${evidenceName}
                  </div>

                `

                : `

                  <span
                    class="empty-evidence"
                  >
                    —
                  </span>

                `;


            return `

              <tr>

                <td>
                  ${date}
                </td>

                <td>
                  ${area}
                </td>

                <td>
                  ${hazard}
                </td>

                <td>
                  ${riskScore}
                </td>


                <td>

                  <span
                    class="
                      risk-level
                      ${riskClass}
                    "
                  >
                    ${riskLevel}
                  </span>

                </td>


                <td>
                  ${evidenceHTML}
                </td>


                <td>

                  <button
                    type="button"
                    class="report-button"
                    onclick="viewReport(${id})"
                  >
                    View Report
                  </button>

                </td>


                <td>

                  <button
                    type="button"
                    class="delete-button"
                    onclick="removeRecord(${id})"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            `;

          }

        )
        .join("");

}


// ======================================================
// VIEW EVIDENCE
// ======================================================

function viewEvidence(
  id
) {

  const record =
    allRecordsCache
      .get(
        Number(
          id
        )
      );


  if (
    !record ||
    !record.evidenceFile
  ) {

    showToast(

      "No evidence file available.",

      "error"

    );


    return;

  }


  try {

    const fileURL =
      URL
        .createObjectURL(
          record.evidenceFile
        );


    const newWindow =
      window.open(

        fileURL,

        "_blank"

      );


    if (
      !newWindow
    ) {

      URL
        .revokeObjectURL(
          fileURL
        );


      showToast(

        "Please allow pop-ups to view the evidence file.",

        "error"

      );


      return;

    }


    setTimeout(

      () => {

        URL
          .revokeObjectURL(
            fileURL
          );

      },

      300000

    );


  } catch (
    error
  ) {

    console.error(

      "Failed to open evidence:",

      error

    );


    showToast(

      "Unable to open evidence file.",

      "error"

    );

  }

}


window.viewEvidence =
  viewEvidence;


// ======================================================
// REPORT EVIDENCE URL CLEANUP
// ======================================================

function clearReportEvidenceURL() {

  if (
    !currentReportEvidenceURL
  ) {

    return;

  }


  URL
    .revokeObjectURL(
      currentReportEvidenceURL
    );


  currentReportEvidenceURL =
    null;

}


// ======================================================
// VIEW REPORT
// ======================================================

function viewReport(
  id
) {

  const record =
    allRecordsCache
      .get(
        Number(
          id
        )
      );


  if (
    !record
  ) {

    showToast(

      "Unable to find this report.",

      "error"

    );


    return;

  }


  if (
    !reportModal ||
    !reportNumber ||
    !reportDate ||
    !reportArea ||
    !reportHazard ||
    !reportLikelihood ||
    !reportSeverity ||
    !reportRiskScore ||
    !reportRiskLevel ||
    !reportDescription ||
    !reportConsequence ||
    !reportAction ||
    !reportEvidenceName ||
    !reportEvidencePreview ||
    !reportCreatedAt
  ) {

    showToast(

      "Report viewer is not available.",

      "error"

    );


    return;

  }


  currentReportRecord =
    record;


  clearReportEvidenceURL();


  reportNumber
    .textContent =
      generateReportNumber(
        record
      );


  reportDate
    .textContent =
      formatRecordDate(
        record.date
      );


  reportArea
    .textContent =

      record.area ||

      "-";


  reportHazard
    .textContent =

      record.hazard ||

      "-";


  reportLikelihood
    .textContent =
      getLikelihoodLabel(
        record.likelihood
      );


  reportSeverity
    .textContent =
      getSeverityLabel(
        record.severity
      );


  reportRiskScore
    .textContent =

      record.riskScore ??

      "-";


  reportRiskLevel
    .textContent =

      record.riskLevel ||

      "-";


  reportRiskLevel
    .className =
      `risk-level ${getRiskClass(
        record.riskLevel
      )}`;


  reportDescription
    .textContent =

      record.description ||

      "Not recorded.";


  reportConsequence
    .textContent =

      record.consequence ||

      "Not recorded.";


  reportAction
    .textContent =

      record.action ||

      "No immediate action recorded.";


  reportCreatedAt
    .textContent =
      formatDateTime(
        record.createdAt
      );


  reportEvidencePreview
    .innerHTML =
      "";


  if (
    record.evidenceFile
  ) {

    reportEvidenceName
      .textContent =

        record.evidenceName ||

        "Attached evidence";


    if (
      isImageEvidence(
        record
      )
    ) {

      currentReportEvidenceURL =
        URL
          .createObjectURL(
            record.evidenceFile
          );


      const image =
        document
          .createElement(
            "img"
          );


      image.src =
        currentReportEvidenceURL;


      image.alt =
        "Supporting evidence";


      image.className =
        "report-evidence-image";


      reportEvidencePreview
        .appendChild(
          image
        );


    } else if (
      isPDFEvidence(
        record
      )
    ) {

      const note =
        document
          .createElement(
            "div"
          );


      note.className =
        "report-pdf-evidence";


      note.textContent =
        "PDF evidence attached. Open the original attachment from the Evidence column in Near-Miss Records.";


      reportEvidencePreview
        .appendChild(
          note
        );

    }


  } else {

    reportEvidenceName
      .textContent =
        "No evidence attached";


    const note =
      document
        .createElement(
          "div"
        );


    note.className =
      "report-no-evidence";


    note.textContent =
      "No supporting evidence was attached to this record.";


    reportEvidencePreview
      .appendChild(
        note
      );

  }


  reportReturnFocusElement =
    document.activeElement;


  reportModal
    .classList
    .remove(
      "hidden"
    );


  document
    .body
    .classList
    .add(
      "report-open"
    );


  /*
    Add one temporary history entry.

    Browser / PWA Back will close the
    report instead of leaving the user
    trapped inside the report screen.
  */

  history
    .pushState(

      {

        ...(
          history.state ||
          {}
        ),

        penguinReportOpen:
          true,

        penguinReportId:
          Number(
            record.id
          )

      },

      "",

      window
        .location
        .href

    );


  reportHistoryActive =
    true;


  setTimeout(

    () => {

      reportClose
        ?.focus();

    },

    0

  );

}


window.viewReport =
  viewReport;


// ======================================================
// HIDE / CLOSE REPORT
// ======================================================

function hideReportModal() {

  if (
    !reportModal
  ) {

    return;

  }


  reportModal
    .classList
    .add(
      "hidden"
    );


  document
    .body
    .classList
    .remove(
      "report-open"
    );


  clearReportEvidenceURL();


  currentReportRecord =
    null;


  reportHistoryActive =
    false;


  if (
    reportEvidencePreview
  ) {

    reportEvidencePreview
      .innerHTML =
        "";

  }


  if (
    reportReturnFocusElement &&
    typeof reportReturnFocusElement.focus ===
      "function"
  ) {

    reportReturnFocusElement
      .focus();

  }


  reportReturnFocusElement =
    null;

}


function closeReport() {

  if (
    reportHistoryActive &&
    history.state &&
    history
      .state
      .penguinReportOpen
  ) {

    history
      .back();


    /*
      Fallback for unusual mobile/PWA
      behaviour where popstate is delayed.
    */

    setTimeout(

      () => {

        if (
          reportModal &&
          !reportModal
            .classList
            .contains(
              "hidden"
            )
        ) {

          hideReportModal();

        }

      },

      350

    );


    return;

  }


  hideReportModal();

}


// ======================================================
// PRINT / SAVE REPORT AS PDF
// ======================================================

function printCurrentReport() {

  if (
    !currentReportRecord
  ) {

    showToast(

      "No report is currently open.",

      "error"

    );


    return;

  }


  if (
    !reportModal ||
    reportModal
      .classList
      .contains(
        "hidden"
      )
  ) {

    showToast(

      "Please open a report before printing.",

      "error"

    );


    return;

  }


  /*
    IMPORTANT MOBILE / PWA FIX

    DO NOT open a new window.

    Print the current app page.

    style.css @media print will hide:
    - dashboard
    - toolbar
    - buttons

    and print only the Near-Miss Report.

    After Print / Save PDF finishes,
    the user remains in this same app
    and can press ← Back.
  */

  window.print();

}


// ======================================================
// DASHBOARD STATISTICS
// ======================================================

function updateStats(
  records
) {

  const totalRecordsElement =
    document
      .getElementById(
        "totalRecords"
      );


  const highRiskElement =
    document
      .getElementById(
        "highRiskCount"
      );


  const averageRiskElement =
    document
      .getElementById(
        "averageRisk"
      );


  const topHazardElement =
    document
      .getElementById(
        "topHazard"
      );


  if (
    totalRecordsElement
  ) {

    totalRecordsElement
      .textContent =
        records.length;

  }


  const highRiskCount =

    records
      .filter(

        record =>

          record.riskLevel ===
            "High" ||

          record.riskLevel ===
            "Critical"

      )
      .length;


  if (
    highRiskElement
  ) {

    highRiskElement
      .textContent =
        highRiskCount;

  }


  const averageRisk =

    records.length

      ? (

          records
            .reduce(

              (
                total,
                record
              ) =>

                total +

                Number(

                  record.riskScore ||

                  0

                ),

              0

            ) /

          records.length

        )
          .toFixed(
            1
          )

      : "0";


  if (
    averageRiskElement
  ) {

    averageRiskElement
      .textContent =
        averageRisk;

  }


  const hazardCounts =
    {};


  records
    .forEach(

      record => {

        const hazard =

          record.hazard ||

          "Unknown";


        hazardCounts[
          hazard
        ] =

          (
            hazardCounts[
              hazard
            ] ||

            0
          ) +

          1;

      }

    );


  let topHazard =
    "-";


  const hazardEntries =
    Object.entries(
      hazardCounts
    );


  if (
    hazardEntries.length >
    0
  ) {

    topHazard =

      hazardEntries
        .sort(

          (
            a,
            b
          ) =>

            b[1] -
            a[1]

        )[0][0];

  }


  if (
    topHazardElement
  ) {

    topHazardElement
      .textContent =
        topHazard;

  }

}


// ======================================================
// DELETE RECORD
// ======================================================

async function removeRecord(
  id
) {

  const confirmed =
    await showConfirm(

      "Delete Record",

      "Are you sure you want to delete this near-miss record?",

      "Delete"

    );


  if (
    !confirmed
  ) {

    return;

  }


  try {

    await deleteRecord(
      id
    );


    showToast(

      "Record deleted.",

      "success"

    );


    await loadDashboard();


  } catch (
    error
  ) {

    console.error(

      "Failed to delete record:",

      error

    );


    showToast(

      "Failed to delete record.",

      "error"

    );

  }

}


window.removeRecord =
  removeRecord;


// ======================================================
// ONLINE / OFFLINE STATUS
// ======================================================

function updateConnectionStatus() {

  const status =
    document
      .getElementById(
        "connectionStatus"
      );


  if (
    !status
  ) {

    return;

  }


  if (
    navigator.onLine
  ) {

    status
      .textContent =
        "Online";


    status
      .className =
        "status-badge risk-low";


  } else {

    status
      .textContent =
        "Offline";


    status
      .className =
        "status-badge risk-medium";

  }

}


// ======================================================
// DATE
// Uses device local date
// ======================================================

function setTodayDate() {

  const dateInput =
    document
      .getElementById(
        "date"
      );


  if (
    !dateInput
  ) {

    return;

  }


  const now =
    new Date();


  const year =
    now
      .getFullYear();


  const month =
    String(

      now
        .getMonth() +

      1

    )
      .padStart(
        2,
        "0"
      );


  const day =
    String(
      now
        .getDate()
    )
      .padStart(
        2,
        "0"
      );


  dateInput
    .value =
      `${year}-${month}-${day}`;

}


// ======================================================
// EVENT LISTENERS
// ======================================================

likelihoodInput
  ?.addEventListener(

    "change",

    updateRiskPreview

  );


severityInput
  ?.addEventListener(

    "change",

    updateRiskPreview

  );


searchInput
  ?.addEventListener(

    "input",

    loadDashboard

  );


riskFilter
  ?.addEventListener(

    "change",

    loadDashboard

  );


areaFilter
  ?.addEventListener(

    "change",

    loadDashboard

  );


// Report Back button

reportClose
  ?.addEventListener(

    "click",

    closeReport

  );


// Print / Save PDF

reportPrint
  ?.addEventListener(

    "click",

    printCurrentReport

  );


// ======================================================
// AFTER PRINT
// ======================================================

window
  .addEventListener(

    "afterprint",

    () => {

      /*
        When the Print / Save PDF dialog
        closes, keep the report open and
        restore focus to ← Back.
      */

      if (
        reportModal &&
        !reportModal
          .classList
          .contains(
            "hidden"
          )
      ) {

        setTimeout(

          () => {

            reportClose
              ?.focus();

          },

          0

        );

      }

    }

  );


// Click backdrop to close report

reportModal
  ?.addEventListener(

    "click",

    event => {

      if (
        event.target ===
        reportModal
      ) {

        closeReport();

      }

    }

  );


// Desktop Escape

document
  .addEventListener(

    "keydown",

    event => {

      if (
        event.key ===
          "Escape" &&

        reportModal &&

        !reportModal
          .classList
          .contains(
            "hidden"
          )
      ) {

        closeReport();

      }

    }

  );


// ======================================================
// BROWSER / PWA BACK NAVIGATION
// ======================================================

window
  .addEventListener(

    "popstate",

    () => {

      if (
        reportModal &&

        !reportModal
          .classList
          .contains(
            "hidden"
          )
      ) {

        hideReportModal();

      }

    }

  );


// Online status

window
  .addEventListener(

    "online",

    updateConnectionStatus

  );


// Offline status

window
  .addEventListener(

    "offline",

    updateConnectionStatus

  );


// ======================================================
// SERVICE WORKER
// ======================================================

if (
  "serviceWorker" in
  navigator
) {

  window
    .addEventListener(

      "load",

      async () => {

        try {

          const registration =
            await navigator
              .serviceWorker
              .register(
                "./service-worker.js"
              );


          await registration
            .update();


          console.log(

            "Service worker registered:",

            registration.scope

          );


        } catch (
          error
        ) {

          console.error(

            "Service worker registration failed:",

            error

          );

        }

      }

    );

}


// ======================================================
// INITIALIZE APP
// ======================================================

document
  .addEventListener(

    "DOMContentLoaded",

    async () => {

      if (
        reportClose
      ) {

        reportClose
          .textContent =
            "← Back";


        reportClose
          .setAttribute(

            "aria-label",

            "Back to near-miss records"

          );

      }


      setTodayDate();


      updateConnectionStatus();


      updateRiskPreview();


      await loadDashboard();

    }

  );
