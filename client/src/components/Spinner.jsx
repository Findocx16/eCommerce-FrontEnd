export default function createSpinner() {
    const dimmer = document.createElement("div");
    dimmer.style =
        "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999;";
    const spinner = document.createElement("div");
    spinner.innerHTML = `
      <div class="d-flex justify-content-center" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
    dimmer.appendChild(spinner);
    return dimmer;
}
