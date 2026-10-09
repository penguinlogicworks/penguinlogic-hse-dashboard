// ======================================================
// PenguinLogic HSE Dashboard
// app.js
// ======================================================

// ======================================================
// DOM ELEMENTS
// ======================================================

const form = document.getElementById("nearMissForm");
const likelihoodInput = document.getElementById("likelihood");
const severityInput = document.getElementById("severity");
const riskScoreDisplay = document.getElementById("riskScore");
const riskLevelDisplay = document.getElementById("riskLevel");
const searchInput = document.getElementById("searchInput");
const riskFilter = document.getElementById("riskFilter");
const areaFilter = document.getElementById("areaFilter");
const recordsTable = document.getElementById("recordsTable");
const evidenceInput = document.getElementById("evidence");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const confirmModal = document.getElementById("confirmModal");
const confirmTitle = document.getElementById("confirmTitle");
const confirmMessage = document.getElementById("confirmMessage");
const confirmCancel = document.getElementById("confirmCancel");
const confirmOk = document.getElementById("confirmOk");

const reportModal = document.getElementById("reportModal");
const reportClose = document.getElementById("reportClose");
const reportPrint = document.getElementById("reportPrint");
const reportNumber = document.getElementById("reportNumber");
const reportDate = document.getElementById("reportDate");
const reportArea = document.getElementById("reportArea");
const reportHazard = document.getElementById("reportHazard");
const reportLikelihood = document.getElementById("reportLikelihood");
const reportSeverity = document.getElementById("reportSeverity");
const reportRiskScore = document.getElementById("reportRiskScore");
const reportRiskLevel = document.getElementById("reportRiskLevel");
const reportDescription = document.getElementById("reportDescription");
const reportConsequence = document.getElementById("reportConsequence");
const reportAction = document.getElementById("reportAction");
const reportEvidenceName = document.getElementById("reportEvidenceName");
const reportEvidencePreview = document.getElementById("reportEvidencePreview");
const reportCreatedAt = document.getElementById("reportCreatedAt");

// ======================================================
// LOCAL STATE
// ======================================================

let allRecordsCache = new Map();

let currentReportRecord = null;
let currentReportEvidenceURL = null;
let reportReturnFocusElement = null;
let reportHistoryActive = false;

let evidenceViewerModal = null;
let evidenceViewerContent = null;
let evidenceViewerFileName = null;
let evidenceViewerClose = null;
let currentEvidenceViewerURL = null;
let evidenceViewerReturnFocusElement = null;
let evidenceHistoryActive = false;

// ======================================================
// HELPERS
// ======================================================

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatRecordDate(value) {
  if (!value) return "-";

  const parts = String(value).split("-");
  if (parts.length !== 3) return String(value);

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  const date = new Date(
    year,
    month - 1,
    day
  );

  if (Number.isNaN(date.getTime())) {
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

function formatDateTime(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
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

function generateReportNumber(record) {
  const date = String(
    record.date || ""
  ).replaceAll("-", "");

  const safeDate =
    date.length === 8
      ? date
      : "00000000";

  const id = String(
    Number(record.id) || 0
  ).padStart(4, "0");

  return `NM-${safeDate}-${id}`;
}

function getLikelihoodLabel(value) {
  const labels = {
    1: "1 - Rare",
    2: "2 - Unlikely",
    3: "3 - Possible",
    4: "4 - Likely",
    5: "5 - Almost Certain"
  };

  return (
    labels[Number(value)] ||
    String(value || "-")
  );
}

function getSeverityLabel(value) {
  const labels = {
    1: "1 - Insignificant",
    2: "2 - Minor",
    3: "3 - Moderate",
    4: "4 - Major",
    5: "5 - Catastrophic"
  };

  return (
    labels[Number(value)] ||
    String(value || "-")
  );
}

function isImageEvidence(record) {
  if (
    !record ||
    !record.evidenceFile
  ) {
    return false;
  }

  const type = String(
    record.evidenceType ||
    record.evidenceFile.type ||
    ""
  ).toLowerCase();

  const name = String(
    record.evidenceName || ""
  ).toLowerCase();

  return (
    type.startsWith("image/") ||
    /\.(jpg|jpeg|png|webp|gif|heic|heif)$/i.test(
      name
    )
  );
}

function isPDFEvidence(record) {
  if (
    !record ||
    !record.evidenceFile
  ) {
    return false;
  }

  const type = String(
    record.evidenceType ||
    record.evidenceFile.type ||
    ""
  ).toLowerCase();

  const name = String(
    record.evidenceName || ""
  ).toLowerCase();

  return (
    type === "application/pdf" ||
    /\.pdf$/i.test(name)
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

        resolve(result);
      }

      function onCancel() {
        cleanup(false);
      }

      function onConfirm() {
        cleanup(true);
      }

      function onBackdrop(
        event
      ) {
        if (
          event.target ===
          confirmModal
        ) {
          cleanup(false);
        }
      }

      function onKeyDown(
        event
      ) {
        if (
          event.key ===
          "Escape"
        ) {
          cleanup(false);
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
  if (
    score <= 4
  ) {
    return {
      level: "Low",
      className: "risk-low"
    };
  }

  if (
    score <= 9
  ) {
    return {
      level: "Medium",
      className: "risk-medium"
    };
  }

  if (
    score <= 16
  ) {
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
  switch (
    level
  ) {
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
    targetCell.classList.add(
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
    likelihood *
    severity;

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

  const isImage =
    allowedImageTypes.includes(
      fileType
    ) ||
    /\.(jpg|jpeg|png|webp|gif|heic|heif)$/i.test(
      fileName
    );

  const isPDF =
    fileType ===
      "application/pdf" ||
    /\.pdf$/i.test(
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
  form.addEventListener(
    "submit",
    async event => {
      event.preventDefault();

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
      records.filter(
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
            return dateComparison;
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
// IN-APP EVIDENCE VIEWER
// ======================================================

function ensureEvidenceViewer() {
  if (
    evidenceViewerModal
  ) {
    return;
  }

  const styleId =
    "penguin-evidence-viewer-style";

  if (
    !document.getElementById(
      styleId
    )
  ) {
    const style =
      document.createElement(
        "style"
      );

    style.id =
      styleId;

    style.textContent = `
      body.evidence-open {
        overflow: hidden;
        overscroll-behavior: none;
      }

      .evidence-viewer-backdrop {
        position: fixed;
        inset: 0;
        z-index: 12000;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 20px;

        background:
          rgba(
            17,
            24,
            39,
            0.78
          );
      }

      .evidence-viewer-backdrop.hidden {
        display: none;
      }

      .evidence-viewer-shell {
        display: flex;
        flex-direction: column;

        width: 100%;
        max-width: 1000px;

        height:
          min(
            88vh,
            820px
          );

        height:
          min(
            88dvh,
            820px
          );

        overflow: hidden;

        background: #ffffff;

        border-radius: 16px;

        box-shadow:
          0
          24px
          70px
          rgba(
            0,
            0,
            0,
            0.34
          );
      }

      .evidence-viewer-toolbar {
        flex-shrink: 0;

        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 16px;

        padding:
          14px
          16px;

        border-bottom:
          1px
          solid
          #e5e7eb;

        background:
          #ffffff;
      }

      .evidence-viewer-heading {
        min-width: 0;
      }

      .evidence-viewer-heading strong {
        display: block;

        color: #111827;

        font-size: 1rem;
      }

      .evidence-viewer-file-name {
        display: block;

        margin-top: 2px;

        overflow: hidden;

        color: #6b7280;

        font-size: 0.78rem;

        text-overflow:
          ellipsis;

        white-space:
          nowrap;
      }

      .evidence-viewer-close {
        flex-shrink: 0;

        min-height: 42px;

        padding:
          9px
          13px;

        border: 0;
        border-radius: 9px;

        background: #e5e7eb;
        color: #111827;

        font: inherit;
        font-weight: 700;

        cursor: pointer;
      }

      .evidence-viewer-close:focus-visible {
        outline:
          3px
          solid
          rgba(
            109,
            93,
            252,
            0.25
          );

        outline-offset: 2px;
      }

      .evidence-viewer-content {
        flex: 1;

        min-height: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        overflow: auto;

        padding: 16px;

        background: #f3f4f6;

        -webkit-overflow-scrolling:
          touch;
      }

      .evidence-viewer-image {
        display: block;

        max-width: 100%;
        max-height: 100%;

        margin: auto;

        object-fit: contain;

        border-radius: 8px;

        background: #ffffff;

        box-shadow:
          0
          2px
          10px
          rgba(
            0,
            0,
            0,
            0.08
          );
      }

      .evidence-viewer-pdf {
        width: 100%;
        height: 100%;

        min-height: 520px;

        border: 0;
        border-radius: 8px;

        background: #ffffff;
      }

      .evidence-viewer-message {
        width:
          min(
            100%,
            560px
          );

        padding: 18px;

        border:
          1px
          solid
          #d1d5db;

        border-radius: 10px;

        background: #ffffff;
        color: #4b5563;

        text-align: center;
      }

      @media (max-width: 600px) {

        .evidence-viewer-backdrop {
          padding: 0;
        }

        .evidence-viewer-shell {
          width: 100%;

          height: 100vh;
          height: 100dvh;

          max-width: none;

          border-radius: 0;
        }

        .evidence-viewer-toolbar {
          padding:
            calc(
              12px +
              env(
                safe-area-inset-top
              )
            )

            max(
              14px,
              env(
                safe-area-inset-right
              )
            )

            12px

            max(
              14px,
              env(
                safe-area-inset-left
              )
            );
        }

        .evidence-viewer-content {
          padding:
            12px

            max(
              12px,
              env(
                safe-area-inset-right
              )
            )

            calc(
              12px +
              env(
                safe-area-inset-bottom
              )
            )

            max(
              12px,
              env(
                safe-area-inset-left
              )
            );
        }

        .evidence-viewer-pdf {
          min-height: 100%;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  evidenceViewerModal =
    document.createElement(
      "div"
    );

  evidenceViewerModal.id =
    "evidenceViewerModal";

  evidenceViewerModal.className =
    "evidence-viewer-backdrop hidden";

  evidenceViewerModal.setAttribute(
    "role",
    "dialog"
  );

  evidenceViewerModal.setAttribute(
    "aria-modal",
    "true"
  );

  evidenceViewerModal.setAttribute(
    "aria-labelledby",
    "evidenceViewerTitle"
  );

  evidenceViewerModal.innerHTML = `
    <div
      class="evidence-viewer-shell"
    >

      <div
        class="evidence-viewer-toolbar"
      >

        <div
          class="evidence-viewer-heading"
        >
          <strong
            id="evidenceViewerTitle"
          >
            Supporting Evidence
          </strong>

          <span
            id="evidenceViewerFileName"
            class="evidence-viewer-file-name"
          ></span>
        </div>

        <button
          type="button"
          id="evidenceViewerClose"
          class="evidence-viewer-close"
          aria-label="Back to near-miss records"
        >
          ← Back
        </button>

      </div>

      <div
        id="evidenceViewerContent"
        class="evidence-viewer-content"
      ></div>

    </div>
  `;

  document.body.appendChild(
    evidenceViewerModal
  );

  evidenceViewerContent =
    document.getElementById(
      "evidenceViewerContent"
    );

  evidenceViewerFileName =
    document.getElementById(
      "evidenceViewerFileName"
    );

  evidenceViewerClose =
    document.getElementById(
      "evidenceViewerClose"
    );

  evidenceViewerClose
    ?.addEventListener(
      "click",
      closeEvidenceViewer
    );

  evidenceViewerModal
    .addEventListener(
      "click",
      event => {
        if (
          event.target ===
          evidenceViewerModal
        ) {
          closeEvidenceViewer();
        }
      }
    );
}

function clearEvidenceViewerURL() {
  if (
    !currentEvidenceViewerURL
  ) {
    return;
  }

  URL.revokeObjectURL(
    currentEvidenceViewerURL
  );

  currentEvidenceViewerURL =
    null;
}

function hideEvidenceViewer() {
  if (
    !evidenceViewerModal
  ) {
    return;
  }

  evidenceViewerModal.classList.add(
    "hidden"
  );

  document.body.classList.remove(
    "evidence-open"
  );

  clearEvidenceViewerURL();

  if (
    evidenceViewerContent
  ) {
    evidenceViewerContent.innerHTML =
      "";
  }

  evidenceHistoryActive =
    false;

  if (
    evidenceViewerReturnFocusElement &&
    typeof evidenceViewerReturnFocusElement.focus ===
      "function"
  ) {
    evidenceViewerReturnFocusElement.focus();
  }

  evidenceViewerReturnFocusElement =
    null;
}

function closeEvidenceViewer() {
  if (
    evidenceHistoryActive &&
    history.state &&
    history.state
      .penguinEvidenceOpen
  ) {
    history.back();

    setTimeout(
      () => {
        if (
          evidenceViewerModal &&
          !evidenceViewerModal
            .classList
            .contains(
              "hidden"
            )
        ) {
          hideEvidenceViewer();
        }
      },
      350
    );

    return;
  }

  hideEvidenceViewer();
}

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
    ensureEvidenceViewer();

    if (
      !evidenceViewerModal ||
      !evidenceViewerContent ||
      !evidenceViewerFileName
    ) {
      showToast(
        "Evidence viewer is not available.",
        "error"
      );

      return;
    }

    clearEvidenceViewerURL();

    evidenceViewerContent.innerHTML =
      "";

    evidenceViewerFileName.textContent =
      record.evidenceName ||
      "Attached evidence";

    currentEvidenceViewerURL =
      URL.createObjectURL(
        record.evidenceFile
      );

    if (
      isImageEvidence(
        record
      )
    ) {
      const image =
        document.createElement(
          "img"
        );

      image.src =
        currentEvidenceViewerURL;

      image.alt =
        record.evidenceName ||
        "Supporting evidence";

      image.className =
        "evidence-viewer-image";

      image.addEventListener(
        "error",
        () => {
          if (
            !evidenceViewerContent
          ) {
            return;
          }

          evidenceViewerContent.innerHTML =
            "";

          const message =
            document.createElement(
              "div"
            );

          message.className =
            "evidence-viewer-message";

          message.textContent =
            "This image format cannot be previewed by this browser.";

          evidenceViewerContent.appendChild(
            message
          );
        },
        {
          once: true
        }
      );

      evidenceViewerContent.appendChild(
        image
      );

    } else if (
      isPDFEvidence(
        record
      )
    ) {
      const frame =
        document.createElement(
          "iframe"
        );

      frame.src =
        currentEvidenceViewerURL;

      frame.className =
        "evidence-viewer-pdf";

      frame.title =
        `PDF evidence: ${
          record.evidenceName ||
          "Supporting evidence"
        }`;

      evidenceViewerContent.appendChild(
        frame
      );

    } else {
      const message =
        document.createElement(
          "div"
        );

      message.className =
        "evidence-viewer-message";

      message.textContent =
        "This evidence format cannot be previewed in the app.";

      evidenceViewerContent.appendChild(
        message
      );
    }

    evidenceViewerReturnFocusElement =
      document.activeElement;

    evidenceViewerModal.classList.remove(
      "hidden"
    );

    document.body.classList.add(
      "evidence-open"
    );

    if (
      !history.state ||
      !history.state
        .penguinEvidenceOpen
    ) {
      history.pushState(
        {
          ...(
            history.state ||
            {}
          ),

          penguinEvidenceOpen:
            true,

          penguinEvidenceId:
            Number(
              record.id
            )
        },

        "",

        window.location.href
      );
    }

    evidenceHistoryActive =
      true;

    setTimeout(
      () => {
        evidenceViewerClose
          ?.focus();
      },
      0
    );

  } catch (
    error
  ) {
    console.error(
      "Failed to open evidence:",
      error
    );

    clearEvidenceViewerURL();

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

  URL.revokeObjectURL(
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
    allRecordsCache.get(
      Number(id)
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

  reportReturnFocusElement =
    document.activeElement;

  reportModal.classList.remove(
    "hidden"
  );

  document.body.classList.add(
    "report-open"
  );

  if (
    !history.state ||
    !history.state
      .penguinReportOpen
  ) {
    history.pushState(
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

      window.location.href
    );
  }

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

  reportModal.classList.add(
    "hidden"
  );

  document.body.classList.remove(
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
    reportEvidencePreview.innerHTML =
      "";
  }

  if (
    reportReturnFocusElement &&
    typeof reportReturnFocusElement.focus ===
      "function"
  ) {
    reportReturnFocusElement.focus();
  }

  reportReturnFocusElement =
    null;
}

function closeReport() {
  if (
    reportHistoryActive &&
    history.state &&
    history.state
      .penguinReportOpen
  ) {
    history.back();

    setTimeout(
      () => {
        if (
          reportModal &&
          !reportModal.classList.contains(
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
    reportModal.classList.contains(
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

    Do not open another window.

    Print the current page so iOS,
    Android and desktop remain inside
    the same application after the
    print dialog closes.
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
    )
      .length;

  if (
    highRiskElement
  ) {
    highRiskElement.textContent =
      highRiskCount;
  }

  const averageRisk =
    records.length
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
    document.getElementById(
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

  if (
    !dateInput
  ) {
    return;
  }

  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() +
      1
    )
      .padStart(
        2,
        "0"
      );

  const day =
    String(
      now.getDate()
    )
      .padStart(
        2,
        "0"
      );

  dateInput.value =
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

window.addEventListener(
  "afterprint",
  () => {
    if (
      reportModal &&
      !reportModal.classList.contains(
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

// Desktop Escape.
// Evidence viewer gets priority.

document.addEventListener(
  "keydown",
  event => {
    if (
      event.key !==
      "Escape"
    ) {
      return;
    }

    if (
      evidenceViewerModal &&
      !evidenceViewerModal
        .classList
        .contains(
          "hidden"
        )
    ) {
      closeEvidenceViewer();

      return;
    }

    if (
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

window.addEventListener(
  "popstate",
  () => {
    if (
      evidenceViewerModal &&
      !evidenceViewerModal
        .classList
        .contains(
          "hidden"
        )
    ) {
      hideEvidenceViewer();

      return;
    }

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

window.addEventListener(
  "online",
  updateConnectionStatus
);

// Offline status

window.addEventListener(
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

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    if (
      reportClose
    ) {
      reportClose.textContent =
        "← Back";

      reportClose.setAttribute(
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