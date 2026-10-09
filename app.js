// ======================================================
// PenguinLogic HSE Dashboard
// app.js
// ======================================================


// ======================================================
// DOM ELEMENTS
// ======================================================

const form =
  document.getElementById("nearMissForm");

const likelihoodInput =
  document.getElementById("likelihood");

const severityInput =
  document.getElementById("severity");

const riskScoreDisplay =
  document.getElementById("riskScore");

const riskLevelDisplay =
  document.getElementById("riskLevel");

const searchInput =
  document.getElementById("searchInput");

const riskFilter =
  document.getElementById("riskFilter");

const areaFilter =
  document.getElementById("areaFilter");

const recordsTable =
  document.getElementById("recordsTable");

const evidenceInput =
  document.getElementById("evidence");


// Toast notification
const toast =
  document.getElementById("toast");

const toastMessage =
  document.getElementById("toastMessage");


// Confirmation modal
const confirmModal =
  document.getElementById("confirmModal");

const confirmTitle =
  document.getElementById("confirmTitle");

const confirmMessage =
  document.getElementById("confirmMessage");

const confirmCancel =
  document.getElementById("confirmCancel");

const confirmOk =
  document.getElementById("confirmOk");


// Near-miss report modal
const reportModal =
  document.getElementById("reportModal");

const reportClose =
  document.getElementById("reportClose");

const reportPrint =
  document.getElementById("reportPrint");

const reportDocument =
  document.getElementById("reportDocument");

const reportNumber =
  document.getElementById("reportNumber");

const reportDate =
  document.getElementById("reportDate");

const reportArea =
  document.getElementById("reportArea");

const reportHazard =
  document.getElementById("reportHazard");

const reportLikelihood =
  document.getElementById("reportLikelihood");

const reportSeverity =
  document.getElementById("reportSeverity");

const reportRiskScore =
  document.getElementById("reportRiskScore");

const reportRiskLevel =
  document.getElementById("reportRiskLevel");

const reportDescription =
  document.getElementById("reportDescription");

const reportConsequence =
  document.getElementById("reportConsequence");

const reportAction =
  document.getElementById("reportAction");

const reportEvidenceName =
  document.getElementById("reportEvidenceName");

const reportEvidencePreview =
  document.getElementById("reportEvidencePreview");

const reportCreatedAt =
  document.getElementById("reportCreatedAt");


// ======================================================
// LOCAL STATE
// ======================================================

let allRecordsCache =
  new Map();

let currentReportRecord =
  null;

let currentReportEvidenceURL =
  null;


// ======================================================
// HELPER
// ======================================================

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


// ======================================================
// DATE HELPERS
// ======================================================

function formatRecordDate(
  value
) {

  if (!value) {
    return "-";
  }


  const parts =
    String(value)
      .split("-");


  if (parts.length !== 3) {
    return String(value);
  }


  const year =
    Number(parts[0]);

  const month =
    Number(parts[1]);

  const day =
    Number(parts[2]);


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

    return String(value);

  }


  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric"
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
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return String(value);

  }


  return date.toLocaleString(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  );

}


// ======================================================
// REPORT NUMBER
// ======================================================

function generateReportNumber(
  record
) {

  const date =
    String(
      record.date || ""
    )
      .replaceAll(
        "-",
        ""
      );


  const safeDate =
    date.length === 8
      ? date
      : "00000000";


  const id =
    String(
      Number(record.id) || 0
    )
      .padStart(
        4,
        "0"
      );


  return (
    `NM-${safeDate}-${id}`
  );

}


// ======================================================
// LIKELIHOOD / SEVERITY LABELS
// ======================================================

function getLikelihoodLabel(
  value
) {

  const labels = {

    1: "1 - Rare",

    2: "2 - Unlikely",

    3: "3 - Possible",

    4: "4 - Likely",

    5: "5 - Almost Certain"

  };


  return (
    labels[
      Number(value)
    ] ||
    String(value || "-")
  );

}


function getSeverityLabel(
  value
) {

  const labels = {

    1: "1 - Insignificant",

    2: "2 - Minor",

    3: "3 - Moderate",

    4: "4 - Major",

    5: "5 - Catastrophic"

  };


  return (
    labels[
      Number(value)
    ] ||
    String(value || "-")
  );

}


// ======================================================
// FILE HELPERS
// ======================================================

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
      record.evidenceFile.type ||
      ""
    ).toLowerCase();


  const name =
    String(
      record.evidenceName ||
      ""
    ).toLowerCase();


  return (
    type.startsWith(
      "image/"
    ) ||
    /\.(jpg|jpeg|png|webp|gif|heic|heif)$/i
      .test(name)
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
      record.evidenceFile.type ||
      ""
    ).toLowerCase();


  const name =
    String(
      record.evidenceName ||
      ""
    ).toLowerCase();


  return (
    type ===
      "application/pdf" ||
    /\.pdf$/i.test(
      name
    )
  );

}


function fileToDataURL(
  file
) {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();


      reader.onload =
        () => {

          resolve(
            reader.result
          );

        };


      reader.onerror =
        () => {

          reject(
            reader.error ||
            new Error(
              "Unable to read evidence file."
            )
          );

        };


      reader.readAsDataURL(
        file
      );

    }
  );

}


// ======================================================
// TOAST NOTIFICATION
// ======================================================

function showToast(
  message,
  type = "info"
) {

  if (
    !toast ||
    !toastMessage
  ) {

    console.log(message);

    return;

  }


  toastMessage.textContent =
    message;


  toast.className =
    `toast toast-${type}`;


  clearTimeout(
    showToast._timeout
  );


  showToast._timeout =
    setTimeout(
      () => {

        toast.classList.add(
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


      confirmTitle.textContent =
        title;


      confirmMessage.textContent =
        message;


      confirmOk.textContent =
        okText;


      confirmModal.classList.remove(
        "hidden"
      );


      setTimeout(
        () => {

          confirmCancel.focus();

        },
        0
      );


      function cleanup(
        result
      ) {

        confirmModal.classList.add(
          "hidden"
        );


        confirmCancel.removeEventListener(
          "click",
          onCancel
        );


        confirmOk.removeEventListener(
          "click",
          onConfirm
        );


        confirmModal.removeEventListener(
          "click",
          onBackdrop
        );


        document.removeEventListener(
          "keydown",
          onKeyDown
        );


        if (
          previousFocus &&
          typeof previousFocus.focus ===
            "function"
        ) {

          previousFocus.focus();

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


      confirmCancel.addEventListener(
        "click",
        onCancel
      );


      confirmOk.addEventListener(
        "click",
        onConfirm
      );


      confirmModal.addEventListener(
        "click",
        onBackdrop
      );


      document.addEventListener(
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

  if (score <= 4) {

    return {
      level: "Low",
      className: "risk-low"
    };

  }


  if (score <= 9) {

    return {
      level: "Medium",
      className: "risk-medium"
    };

  }


  if (score <= 16) {

    return {
      level: "High",
      className: "risk-high"
    };

  }


  return {
    level: "Critical",
    className: "risk-critical"
  };

}


function getRiskClass(
  level
) {

  switch (level) {

    case "Low":
      return "risk-low";

    case "Medium":
      return "risk-medium";

    case "High":
      return "risk-high";

    case "Critical":
      return "risk-critical";

    default:
      return "";

  }

}


// ======================================================
// RISK MATRIX
// ======================================================

function highlightRiskMatrix(
  likelihood,
  severity
) {

  const allCells =
    Array.from(
      document.querySelectorAll(
        ".matrix-cell"
      )
    );


  allCells.forEach(
    cell => {

      cell.classList.remove(
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
    (5 - likelihood) * 5 +
    (severity - 1);


  const targetCell =
    allCells[targetIndex];


  if (targetCell) {

    targetCell.classList.add(
      "active-risk"
    );

  }

}


// ======================================================
// RISK PREVIEW
// ======================================================

function updateRiskPreview() {

  const likelihood =
    Number(
      likelihoodInput.value
    );


  const severity =
    Number(
      severityInput.value
    );


  if (
    !likelihood ||
    !severity
  ) {

    riskScoreDisplay.textContent =
      "-";


    riskLevelDisplay.textContent =
      "Select likelihood and severity";


    riskLevelDisplay.className =
      "risk-level";


    highlightRiskMatrix(
      null,
      null
    );


    return;

  }


  const score =
    likelihood * severity;


  const risk =
    calculateRiskLevel(
      score
    );


  riskScoreDisplay.textContent =
    score;


  riskLevelDisplay.textContent =
    risk.level;


  riskLevelDisplay.className =
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

  if (!file) {

    return true;

  }


  const maxFileSize =
    10 * 1024 * 1024;


  const fileName =
    String(
      file.name || ""
    ).toLowerCase();


  const fileType =
    String(
      file.type || ""
    ).toLowerCase();


  const allowedImageTypes = [

    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/heic",
    "image/heif"

  ];


  const imageExtension =
    /\.(jpg|jpeg|png|webp|gif|heic|heif)$/i;


  const pdfExtension =
    /\.pdf$/i;


  const isImage =
    allowedImageTypes.includes(
      fileType
    ) ||
    imageExtension.test(
      fileName
    );


  const isPDF =
    fileType ===
      "application/pdf" ||
    pdfExtension.test(
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

form.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const likelihood =
      Number(
        likelihoodInput.value
      );


    const severity =
      Number(
        severityInput.value
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
      evidenceInput?.files?.[0] ||
      null;


    if (
      !validateEvidence(
        evidenceFile
      )
    ) {

      return;

    }


    const riskScore =
      likelihood * severity;


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
          .value,

      area:
        document
          .getElementById(
            "area"
          )
          .value,

      hazard:
        document
          .getElementById(
            "hazard"
          )
          .value,

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
          .value
          .trim(),

      consequence:
        document
          .getElementById(
            "consequence"
          )
          .value
          .trim(),

      action:
        document
          .getElementById(
            "action"
          )
          .value
          .trim(),

      evidenceFile,

      evidenceName:
        evidenceFile
          ? evidenceFile.name
          : null,

      evidenceType:
        evidenceFile
          ? evidenceFile.type
          : null,

      evidenceSize:
        evidenceFile
          ? evidenceFile.size
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


      form.reset();


      setTodayDate();


      updateRiskPreview();


      await loadDashboard();

    } catch (error) {

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


// ======================================================
// LOAD + FILTER DASHBOARD
// ======================================================

async function loadDashboard() {

  try {

    const records =
      await getAllRecords();


    allRecordsCache =
      new Map(
        records.map(
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
        searchInput?.value ??
        ""
      )
        .toLowerCase()
        .trim();


    const selectedRisk =
      riskFilter?.value ??
      "";


    const selectedArea =
      areaFilter?.value ??
      "";


    const filteredRecords =
      records.filter(
        record => {

          const area =
            String(
              record.area ??
              ""
            ).toLowerCase();


          const hazard =
            String(
              record.hazard ??
              ""
            ).toLowerCase();


          const description =
            String(
              record.description ??
              ""
            ).toLowerCase();


          const consequence =
            String(
              record.consequence ??
              ""
            ).toLowerCase();


          const action =
            String(
              record.action ??
              ""
            ).toLowerCase();


          const evidenceName =
            String(
              record.evidenceName ??
              ""
            ).toLowerCase();


          const matchesSearch =

            !searchTerm ||

            area.includes(
              searchTerm
            ) ||

            hazard.includes(
              searchTerm
            ) ||

            description.includes(
              searchTerm
            ) ||

            consequence.includes(
              searchTerm
            ) ||

            action.includes(
              searchTerm
            ) ||

            evidenceName.includes(
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

  } catch (error) {

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

  if (!recordsTable) {

    return;

  }


  if (
    records.length ===
    0
  ) {

    recordsTable.innerHTML = `
      <tr>
        <td colspan="8">
          No matching records found.
        </td>
      </tr>
    `;


    return;

  }


  const sortedRecords =
    [...records].sort(
      (a, b) => {

        const dateComparison =
          String(
            b.date || ""
          ).localeCompare(
            String(
              a.date || ""
            )
          );


        if (
          dateComparison !==
          0
        ) {

          return dateComparison;

        }


        return String(
          b.createdAt || ""
        ).localeCompare(
          String(
            a.createdAt || ""
          )
        );

      }
    );


  recordsTable.innerHTML =
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
                  onclick="
                    viewEvidence(${id})
                  "
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
                  onclick="
                    viewReport(${id})
                  "
                >
                  View Report
                </button>

              </td>

              <td>

                <button
                  type="button"
                  class="delete-button"
                  onclick="
                    removeRecord(${id})
                  "
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
    allRecordsCache.get(
      Number(id)
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
      URL.createObjectURL(
        record.evidenceFile
      );


    const newWindow =
      window.open(
        fileURL,
        "_blank"
      );


    if (!newWindow) {

      URL.revokeObjectURL(
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

        URL.revokeObjectURL(
          fileURL
        );

      },
      300000
    );

  } catch (error) {

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
    currentReportEvidenceURL
  ) {

    URL.revokeObjectURL(
      currentReportEvidenceURL
    );


    currentReportEvidenceURL =
      null;

  }

}


// ======================================================
// VIEW REPORT
// ======================================================

function viewReport(
  id
) {

  const record =
    allRecordsCache.get(
      Number(id)
    );


  if (!record) {

    showToast(
      "Unable to find this report.",
      "error"
    );


    return;

  }


  currentReportRecord =
    record;


  clearReportEvidenceURL();


  reportNumber.textContent =
    generateReportNumber(
      record
    );


  reportDate.textContent =
    formatRecordDate(
      record.date
    );


  reportArea.textContent =
    record.area ||
    "-";


  reportHazard.textContent =
    record.hazard ||
    "-";


  reportLikelihood.textContent =
    getLikelihoodLabel(
      record.likelihood
    );


  reportSeverity.textContent =
    getSeverityLabel(
      record.severity
    );


  reportRiskScore.textContent =
    record.riskScore ??
    "-";


  reportRiskLevel.textContent =
    record.riskLevel ||
    "-";


  reportRiskLevel.className =
    `risk-level ${getRiskClass(
      record.riskLevel
    )}`;


  reportDescription.textContent =
    record.description ||
    "Not recorded.";


  reportConsequence.textContent =
    record.consequence ||
    "Not recorded.";


  reportAction.textContent =
    record.action ||
    "No immediate action recorded.";


  reportCreatedAt.textContent =
    formatDateTime(
      record.createdAt
    );


  reportEvidencePreview.innerHTML =
    "";


  if (
    record.evidenceFile
  ) {

    reportEvidenceName.textContent =
      record.evidenceName ||
      "Attached evidence";


    if (
      isImageEvidence(
        record
      )
    ) {

      currentReportEvidenceURL =
        URL.createObjectURL(
          record.evidenceFile
        );


      const image =
        document.createElement(
          "img"
        );


      image.src =
        currentReportEvidenceURL;


      image.alt =
        "Supporting evidence";


      image.className =
        "report-evidence-image";


      reportEvidencePreview.appendChild(
        image
      );

    } else if (
      isPDFEvidence(
        record
      )
    ) {

      const note =
        document.createElement(
          "div"
        );


      note.className =
        "report-pdf-evidence";


      note.textContent =
        "PDF evidence attached. Open the original attachment from the Evidence column in Near-Miss Records.";


      reportEvidencePreview.appendChild(
        note
      );

    }

  } else {

    reportEvidenceName.textContent =
      "No evidence attached";


    const note =
      document.createElement(
        "div"
      );


    note.className =
      "report-no-evidence";


    note.textContent =
      "No supporting evidence was attached to this record.";


    reportEvidencePreview.appendChild(
      note
    );

  }


  reportModal.classList.remove(
    "hidden"
  );


  document.body.classList.add(
    "report-open"
  );


  setTimeout(
    () => {

      reportClose?.focus();

    },
    0
  );

}


window.viewReport =
  viewReport;


// ======================================================
// CLOSE REPORT
// ======================================================

function closeReport() {

  if (!reportModal) {

    return;

  }


  reportModal.classList.add(
    "hidden"
  );


  document.body.classList.remove(
    "report-open"
  );


  clearReportEvidenceURL();


  currentReportRecord =
    null;


  if (
    reportEvidencePreview
  ) {

    reportEvidencePreview.innerHTML =
      "";

  }

}


// ======================================================
// PRINT / SAVE REPORT AS PDF
// ======================================================

async function printCurrentReport() {

  if (
    !currentReportRecord
  ) {

    showToast(
      "No report is currently open.",
      "error"
    );


    return;

  }


  const record =
    currentReportRecord;


  const printWindow =
    window.open(
      "",
      "_blank"
    );


  if (!printWindow) {

    showToast(
      "Please allow pop-ups to print or save the report.",
      "error"
    );


    return;

  }


  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Preparing Near-Miss Report...</title>
    </head>
    <body>
      <p style="
        font-family: Arial, sans-serif;
        padding: 20px;
      ">
        Preparing report...
      </p>
    </body>
    </html>
  `);

  printWindow.document.close();


  let evidenceMarkup =
    `
      <div class="evidence-empty">
        No supporting evidence attached.
      </div>
    `;


  if (
    record.evidenceFile
  ) {

    if (
      isImageEvidence(
        record
      )
    ) {

      try {

        const dataURL =
          await fileToDataURL(
            record.evidenceFile
          );


        evidenceMarkup = `
          <div class="evidence-file">
            <strong>
              ${escapeHTML(
                record.evidenceName ||
                "Image evidence"
              )}
            </strong>
          </div>

          <img
            class="evidence-image"
            src="${dataURL}"
            alt="Supporting evidence"
          >
        `;

      } catch (error) {

        console.error(
          "Unable to prepare image for report:",
          error
        );


        evidenceMarkup = `
          <div class="evidence-file">
            Evidence attached:
            <strong>
              ${escapeHTML(
                record.evidenceName ||
                "Image evidence"
              )}
            </strong>
          </div>
        `;

      }

    } else if (
      isPDFEvidence(
        record
      )
    ) {

      evidenceMarkup = `
        <div class="pdf-evidence">
          <strong>
            PDF Attachment
          </strong>

          <div>
            ${escapeHTML(
              record.evidenceName ||
              "Attached PDF"
            )}
          </div>

          <p>
            The original PDF evidence is stored with
            this near-miss record.
          </p>
        </div>
      `;

    }

  }


  const riskLevel =
    String(
      record.riskLevel ||
      "-"
    );


  let riskBackground =
    "#e5e7eb";

  let riskColor =
    "#111827";


  if (
    riskLevel ===
    "Low"
  ) {

    riskBackground =
      "#dcfce7";

    riskColor =
      "#166534";

  } else if (
    riskLevel ===
    "Medium"
  ) {

    riskBackground =
      "#fef3c7";

    riskColor =
      "#92400e";

  } else if (
    riskLevel ===
    "High"
  ) {

    riskBackground =
      "#fed7aa";

    riskColor =
      "#9a3412";

  } else if (
    riskLevel ===
    "Critical"
  ) {

    riskBackground =
      "#fee2e2";

    riskColor =
      "#991b1b";

  }


  const reportHTML = `
    <!DOCTYPE html>

    <html lang="en">

    <head>

      <meta charset="UTF-8">

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      >

      <title>
        ${escapeHTML(
          generateReportNumber(
            record
          )
        )} - Near-Miss Report
      </title>

      <style>

        @page {
          size: A4;
          margin: 12mm;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          font-size: 11pt;
          line-height: 1.45;

          background: #ffffff;
          color: #111827;
        }

        .report {
          width: 100%;
          max-width: 190mm;

          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;

          gap: 20px;

          padding-bottom: 18px;

          border-bottom:
            3px solid #6d5dfc;
        }

        .brand {
          display: flex;
          align-items: center;

          gap: 12px;
        }

        .brand-mark {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 44px;
          height: 44px;

          border-radius: 10px;

          background: #6d5dfc;
          color: #ffffff;

          font-size: 15pt;
          font-weight: 800;
        }

        .brand h1 {
          margin: 0;

          font-size: 17pt;
        }

        .brand p {
          margin: 2px 0 0;

          color: #6b7280;

          font-size: 9.5pt;
        }

        .document-title {
          text-align: right;
        }

        .document-title span {
          display: block;

          color: #6b7280;

          font-size: 8.5pt;
          font-weight: 700;

          letter-spacing: 1px;
        }

        .document-title h2 {
          margin: 4px 0 0;

          font-size: 16pt;
        }

        .reference {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 12px;

          margin-top: 18px;

          padding: 13px;

          background: #f8fafc;

          border:
            1px solid #e5e7eb;

          border-radius: 8px;
        }

        .section {
          margin-top: 18px;

          break-inside: avoid;
        }

        .section h3 {
          margin:
            0 0 10px;

          padding-bottom: 6px;

          border-bottom:
            1px solid #d1d5db;

          font-size: 11pt;
        }

        .info-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 10px;
        }

        .risk-grid {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 8px;
        }

        .info-item,
        .risk-item {
          padding: 10px;

          background: #f9fafb;

          border:
            1px solid #e5e7eb;

          border-radius: 7px;
        }

        .label {
          display: block;

          margin-bottom: 4px;

          color: #6b7280;

          font-size: 8.5pt;
          font-weight: 700;

          text-transform: uppercase;
        }

        .text-box {
          min-height: 55px;

          padding: 11px;

          background: #ffffff;

          border:
            1px solid #d1d5db;

          border-radius: 7px;

          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .risk-badge {
          display: inline-block;

          padding:
            4px 8px;

          border-radius: 999px;

          background:
            ${riskBackground};

          color:
            ${riskColor};

          font-size: 9pt;
          font-weight: 700;
        }

        .evidence-box {
          padding: 11px;

          border:
            1px solid #d1d5db;

          border-radius: 7px;
        }

        .evidence-file {
          margin-bottom: 10px;

          color: #374151;
        }

        .evidence-image {
          display: block;

          width: auto;
          max-width: 100%;
          max-height: 115mm;

          margin:
            10px auto 0;

          object-fit: contain;

          border-radius: 6px;

          border:
            1px solid #e5e7eb;
        }

        .pdf-evidence {
          padding: 12px;

          background: #f9fafb;

          border-radius: 7px;
        }

        .pdf-evidence p {
          margin:
            7px 0 0;

          color: #6b7280;

          font-size: 9pt;
        }

        .evidence-empty {
          color: #6b7280;
        }

        .record-info {
          padding: 10px;

          background: #f9fafb;

          border:
            1px solid #e5e7eb;

          border-radius: 7px;
        }

        .footer {
          display: flex;
          justify-content: space-between;

          gap: 20px;

          margin-top: 24px;

          padding-top: 12px;

          border-top:
            1px solid #d1d5db;

          color: #6b7280;

          font-size: 8pt;
        }

        .footer strong {
          display: block;

          color: #374151;
        }

        @media print {

          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

        }

        @media (max-width: 700px) {

          .header {
            display: block;
          }

          .document-title {
            margin-top: 15px;

            text-align: left;
          }

          .risk-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

        }

      </style>

    </head>


    <body>

      <article class="report">


        <header class="header">

          <div class="brand">

            <div class="brand-mark">
              PL
            </div>

            <div>

              <h1>
                PenguinLogic HSE
              </h1>

              <p>
                Health, Safety & Environment
              </p>

            </div>

          </div>


          <div class="document-title">

            <span>
              HSE RECORD
            </span>

            <h2>
              NEAR-MISS REPORT
            </h2>

          </div>

        </header>


        <div class="reference">

          <div>

            <span class="label">
              Report No.
            </span>

            <strong>
              ${escapeHTML(
                generateReportNumber(
                  record
                )
              )}
            </strong>

          </div>


          <div>

            <span class="label">
              Event Type
            </span>

            <strong>
              Near Miss
            </strong>

          </div>

        </div>


        <section class="section">

          <h3>
            1. Report Information
          </h3>


          <div class="info-grid">

            <div class="info-item">

              <span class="label">
                Date
              </span>

              <strong>
                ${escapeHTML(
                  formatRecordDate(
                    record.date
                  )
                )}
              </strong>

            </div>


            <div class="info-item">

              <span class="label">
                Area
              </span>

              <strong>
                ${escapeHTML(
                  record.area ||
                  "-"
                )}
              </strong>

            </div>


            <div class="info-item">

              <span class="label">
                Hazard Category
              </span>

              <strong>
                ${escapeHTML(
                  record.hazard ||
                  "-"
                )}
              </strong>

            </div>

          </div>

        </section>


        <section class="section">

          <h3>
            2. Risk Assessment
          </h3>


          <div class="risk-grid">

            <div class="risk-item">

              <span class="label">
                Likelihood
              </span>

              <strong>
                ${escapeHTML(
                  getLikelihoodLabel(
                    record.likelihood
                  )
                )}
              </strong>

            </div>


            <div class="risk-item">

              <span class="label">
                Severity
              </span>

              <strong>
                ${escapeHTML(
                  getSeverityLabel(
                    record.severity
                  )
                )}
              </strong>

            </div>


            <div class="risk-item">

              <span class="label">
                Risk Score
              </span>

              <strong>
                ${escapeHTML(
                  record.riskScore ??
                  "-"
                )}
              </strong>

            </div>


            <div class="risk-item">

              <span class="label">
                Risk Level
              </span>

              <span class="risk-badge">
                ${escapeHTML(
                  record.riskLevel ||
                  "-"
                )}
              </span>

            </div>

          </div>

        </section>


        <section class="section">

          <h3>
            3. Near-Miss Description
          </h3>

          <div class="text-box">
${escapeHTML(
  record.description ||
  "Not recorded."
)}
          </div>

        </section>


        <section class="section">

          <h3>
            4. Potential Consequence
          </h3>

          <div class="text-box">
${escapeHTML(
  record.consequence ||
  "Not recorded."
)}
          </div>

        </section>


        <section class="section">

          <h3>
            5. Immediate Action Taken
          </h3>

          <div class="text-box">
${escapeHTML(
  record.action ||
  "No immediate action recorded."
)}
          </div>

        </section>


        <section class="section">

          <h3>
            6. Supporting Evidence
          </h3>


          <div class="evidence-box">

            ${evidenceMarkup}

          </div>

        </section>


        <section class="section">

          <h3>
            7. Record Information
          </h3>


          <div class="record-info">

            <span class="label">
              Record Created
            </span>

            <strong>
              ${escapeHTML(
                formatDateTime(
                  record.createdAt
                )
              )}
            </strong>

          </div>

        </section>


        <footer class="footer">

          <div>

            <strong>
              PenguinLogic HSE
            </strong>

            Near-Miss & Risk Dashboard

          </div>


          <div>
            This report was generated from a locally stored HSE record.
          </div>

        </footer>


      </article>

    </body>

    </html>
  `;


  printWindow.document.open();

  printWindow.document.write(
    reportHTML
  );

  printWindow.document.close();


  printWindow.focus();


  setTimeout(
    () => {

      printWindow.print();

    },
    500
  );

}


// ======================================================
// DASHBOARD STATISTICS
// ======================================================

function updateStats(
  records
) {

  const totalRecordsElement =
    document.getElementById(
      "totalRecords"
    );


  const highRiskElement =
    document.getElementById(
      "highRiskCount"
    );


  const averageRiskElement =
    document.getElementById(
      "averageRisk"
    );


  const topHazardElement =
    document.getElementById(
      "topHazard"
    );


  if (
    totalRecordsElement
  ) {

    totalRecordsElement.textContent =
      records.length;

  }


  const highRiskCount =
    records.filter(
      record =>

        record.riskLevel ===
          "High" ||

        record.riskLevel ===
          "Critical"

    ).length;


  if (
    highRiskElement
  ) {

    highRiskElement.textContent =
      highRiskCount;

  }


  const averageRisk =

    records.length > 0

      ? (
          records.reduce(
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
        ).toFixed(1)

      : "0";


  if (
    averageRiskElement
  ) {

    averageRiskElement.textContent =
      averageRisk;

  }


  const hazardCounts =
    {};


  records.forEach(
    record => {

      const hazard =
        record.hazard ||
        "Unknown";


      hazardCounts[hazard] =
        (
          hazardCounts[hazard] ||
          0
        ) + 1;

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
      hazardEntries.sort(
        (a, b) =>
          b[1] - a[1]
      )[0][0];

  }


  if (
    topHazardElement
  ) {

    topHazardElement.textContent =
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


  if (!confirmed) {

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

  } catch (error) {

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
    document.getElementById(
      "connectionStatus"
    );


  if (!status) {

    return;

  }


  if (
    navigator.onLine
  ) {

    status.textContent =
      "Online";


    status.className =
      "status-badge risk-low";

  } else {

    status.textContent =
      "Offline";


    status.className =
      "status-badge risk-medium";

  }

}


// ======================================================
// DATE
// Uses device local date
// ======================================================

function setTodayDate() {

  const dateInput =
    document.getElementById(
      "date"
    );


  if (!dateInput) {

    return;

  }


  const now =
    new Date();


  const year =
    now.getFullYear();


  const month =
    String(
      now.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const day =
    String(
      now.getDate()
    ).padStart(
      2,
      "0"
    );


  dateInput.value =
    `${year}-${month}-${day}`;

}


// ======================================================
// EVENT LISTENERS
// ======================================================

likelihoodInput.addEventListener(
  "change",
  updateRiskPreview
);


severityInput.addEventListener(
  "change",
  updateRiskPreview
);


if (
  searchInput
) {

  searchInput.addEventListener(
    "input",
    loadDashboard
  );

}


if (
  riskFilter
) {

  riskFilter.addEventListener(
    "change",
    loadDashboard
  );

}


if (
  areaFilter
) {

  areaFilter.addEventListener(
    "change",
    loadDashboard
  );

}


// Report modal close
if (
  reportClose
) {

  reportClose.addEventListener(
    "click",
    closeReport
  );

}


// Report print / save PDF
if (
  reportPrint
) {

  reportPrint.addEventListener(
    "click",
    printCurrentReport
  );

}


// Close report when clicking backdrop
if (
  reportModal
) {

  reportModal.addEventListener(
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

}


// Escape key closes report
document.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
        "Escape" &&
      reportModal &&
      !reportModal.classList.contains(
        "hidden"
      )
    ) {

      closeReport();

    }

  }
);


window.addEventListener(
  "online",
  updateConnectionStatus
);


window.addEventListener(
  "offline",
  updateConnectionStatus
);


// ======================================================
// SERVICE WORKER
// OFFLINE PWA SUPPORT
// ======================================================

if (
  "serviceWorker" in
  navigator
) {

  window.addEventListener(
    "load",
    async () => {

      try {

        const registration =
          await navigator
            .serviceWorker
            .register(
              "./service-worker.js"
            );


        await registration.update();


        console.log(
          "Service worker registered:",
          registration.scope
        );

      } catch (error) {

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

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    setTodayDate();


    updateConnectionStatus();


    updateRiskPreview();


    await loadDashboard();

  }
);