(function () {
  "use strict";

  // Global visual constants for the heuristic renderer.
  var VISUAL = {
    brainRadius: 1.0,
    scalpRadius: 1.35,
    tdcsSigma: 0.56,
    hdSigma: 0.42,
    returnWeight: -0.68,
    minIntensity: 0.30,
    maxIntensity: 1.0
  };

  // 10-20 / 10-10 inspired cap positions used by both 2D and 3D views.
  var ELECTRODE_CAP = {
    Fp1: { x: -0.35, y: -0.84 },
    Fp2: { x: 0.35, y: -0.84 },
    Fpz: { x: 0.00, y: -0.88 },
    AF3: { x: -0.24, y: -0.66 },
    AF4: { x: 0.24, y: -0.66 },
    F7: { x: -0.78, y: -0.52 },
    F8: { x: 0.78, y: -0.52 },
    F3: { x: -0.42, y: -0.45 },
    F4: { x: 0.42, y: -0.45 },
    Fz: { x: 0.00, y: -0.45 },
    FC1: { x: -0.20, y: -0.22 },
    FC2: { x: 0.20, y: -0.22 },
    C3: { x: -0.45, y: 0.00 },
    C4: { x: 0.45, y: 0.00 },
    Cz: { x: 0.00, y: 0.00 },
    T7: { x: -0.87, y: 0.00 },
    T8: { x: 0.87, y: 0.00 },
    CP1: { x: -0.22, y: 0.24 },
    CP2: { x: 0.22, y: 0.24 },
    P3: { x: -0.40, y: 0.46 },
    P4: { x: 0.40, y: 0.46 },
    Pz: { x: 0.00, y: 0.50 },
    O1: { x: -0.28, y: 0.78 },
    O2: { x: 0.28, y: 0.78 },
    Oz: { x: 0.00, y: 0.82 }
  };

  var ELECTRODES = buildElectrodes(ELECTRODE_CAP);

  // Educational cortical targets with proxy 3D coordinates and preferred montage IDs.
  var TARGETS = [
    {
      id: "dlpfc_left",
      name: "DLPFC Left",
      hemisphere: "left",
      brainCoord: { x: -0.43, y: 0.33, z: 0.52 },
      scalpCoordName: "F3",
      preferredMontages: ["tdcs_f3_fp2", "hd_f3_ring"]
    },
    {
      id: "dlpfc_right",
      name: "DLPFC Right",
      hemisphere: "right",
      brainCoord: { x: 0.43, y: 0.33, z: 0.52 },
      scalpCoordName: "F4",
      preferredMontages: ["tdcs_f4_fp1", "hd_f4_ring"]
    },
    {
      id: "m1_left",
      name: "M1 Left",
      hemisphere: "left",
      brainCoord: { x: -0.52, y: 0.21, z: 0.06 },
      scalpCoordName: "C3",
      preferredMontages: ["tdcs_c3_fp2", "hd_c3_ring"]
    },
    {
      id: "m1_right",
      name: "M1 Right",
      hemisphere: "right",
      brainCoord: { x: 0.52, y: 0.21, z: 0.06 },
      scalpCoordName: "C4",
      preferredMontages: ["tdcs_c4_fp1", "hd_c4_ring"]
    },
    {
      id: "vmpfc",
      name: "vmPFC",
      hemisphere: "midline",
      brainCoord: { x: 0.00, y: 0.20, z: 0.67 },
      scalpCoordName: "Fpz",
      preferredMontages: ["tdcs_fpz_pz", "hd_fpz_ring"]
    },
    {
      id: "ofc_left",
      name: "OFC Left",
      hemisphere: "left",
      brainCoord: { x: -0.36, y: 0.06, z: 0.67 },
      scalpCoordName: "Fp1",
      preferredMontages: ["tdcs_fp1_p4", "hd_fp1_ring"]
    },
    {
      id: "ofc_right",
      name: "OFC Right",
      hemisphere: "right",
      brainCoord: { x: 0.36, y: 0.06, z: 0.67 },
      scalpCoordName: "Fp2",
      preferredMontages: ["tdcs_fp2_p3", "hd_fp2_ring"]
    },
    {
      id: "ifg_left",
      name: "IFG Left",
      hemisphere: "left",
      brainCoord: { x: -0.62, y: 0.20, z: 0.38 },
      scalpCoordName: "F7",
      preferredMontages: ["tdcs_f7_fp2", "hd_f7_ring"]
    },
    {
      id: "ifg_right",
      name: "IFG Right",
      hemisphere: "right",
      brainCoord: { x: 0.62, y: 0.20, z: 0.38 },
      scalpCoordName: "F8",
      preferredMontages: ["tdcs_f8_fp1", "hd_f8_ring"]
    },
    {
      id: "tpj_left",
      name: "TPJ Left",
      hemisphere: "left",
      brainCoord: { x: -0.73, y: 0.16, z: -0.02 },
      scalpCoordName: "T7",
      preferredMontages: ["tdcs_t7_fp2", "hd_t7_ring"]
    },
    {
      id: "tpj_right",
      name: "TPJ Right",
      hemisphere: "right",
      brainCoord: { x: 0.73, y: 0.16, z: -0.02 },
      scalpCoordName: "T8",
      preferredMontages: ["tdcs_t8_fp1", "hd_t8_ring"]
    },
    {
      id: "ppc_left",
      name: "PPC Left",
      hemisphere: "left",
      brainCoord: { x: -0.43, y: 0.45, z: -0.26 },
      scalpCoordName: "P3",
      preferredMontages: ["tdcs_p3_fp2", "hd_p3_ring"]
    },
    {
      id: "ppc_right",
      name: "PPC Right",
      hemisphere: "right",
      brainCoord: { x: 0.43, y: 0.45, z: -0.26 },
      scalpCoordName: "P4",
      preferredMontages: ["tdcs_p4_fp1", "hd_p4_ring"]
    },
    {
      id: "sma",
      name: "SMA",
      hemisphere: "midline",
      brainCoord: { x: 0.00, y: 0.56, z: 0.11 },
      scalpCoordName: "Cz",
      preferredMontages: ["tdcs_cz_oz", "hd_cz_ring"]
    },
    {
      id: "v1",
      name: "V1",
      hemisphere: "midline",
      brainCoord: { x: 0.00, y: 0.20, z: -0.71 },
      scalpCoordName: "Oz",
      preferredMontages: ["tdcs_oz_fz", "hd_oz_ring"]
    }
  ];

  // Rule-based montage catalog for standard tDCS and HD-tDCS 4x1.
  var MONTAGES = [
    {
      id: "tdcs_f3_fp2",
      mode: "tdcs",
      label: "F3 -> Fp2",
      active: [
        { name: "F3", role: "anode" },
        { name: "Fp2", role: "cathode" }
      ],
      targets: ["dlpfc_left"],
      rationale: "Left frontal lead at F3 with contralateral frontal return to bias DLPFC-left coverage."
    },
    {
      id: "tdcs_f4_fp1",
      mode: "tdcs",
      label: "F4 -> Fp1",
      active: [
        { name: "F4", role: "anode" },
        { name: "Fp1", role: "cathode" }
      ],
      targets: ["dlpfc_right"],
      rationale: "Right frontal lead at F4 with contralateral return for right DLPFC-oriented flow."
    },
    {
      id: "tdcs_c3_fp2",
      mode: "tdcs",
      label: "C3 -> Fp2",
      active: [
        { name: "C3", role: "anode" },
        { name: "Fp2", role: "cathode" }
      ],
      targets: ["m1_left"],
      rationale: "Motor-left proxy at C3 with anterior contralateral return for simple bipolar orientation."
    },
    {
      id: "tdcs_c4_fp1",
      mode: "tdcs",
      label: "C4 -> Fp1",
      active: [
        { name: "C4", role: "anode" },
        { name: "Fp1", role: "cathode" }
      ],
      targets: ["m1_right"],
      rationale: "Motor-right proxy at C4 with anterior contralateral return for simple bipolar orientation."
    },
    {
      id: "tdcs_fpz_pz",
      mode: "tdcs",
      label: "Fpz -> Pz",
      active: [
        { name: "Fpz", role: "anode" },
        { name: "Pz", role: "cathode" }
      ],
      targets: ["vmpfc"],
      rationale: "Midline prefrontal lead with posterior return as a heuristic vmPFC-oriented setup."
    },
    {
      id: "tdcs_fp1_p4",
      mode: "tdcs",
      label: "Fp1 -> P4",
      active: [
        { name: "Fp1", role: "anode" },
        { name: "P4", role: "cathode" }
      ],
      targets: ["ofc_left"],
      rationale: "Left orbitofrontal lead with diagonal posterior return to keep visual asymmetry."
    },
    {
      id: "tdcs_fp2_p3",
      mode: "tdcs",
      label: "Fp2 -> P3",
      active: [
        { name: "Fp2", role: "anode" },
        { name: "P3", role: "cathode" }
      ],
      targets: ["ofc_right"],
      rationale: "Right orbitofrontal lead with diagonal posterior return to keep visual asymmetry."
    },
    {
      id: "tdcs_f7_fp2",
      mode: "tdcs",
      label: "F7 -> Fp2",
      active: [
        { name: "F7", role: "anode" },
        { name: "Fp2", role: "cathode" }
      ],
      targets: ["ifg_left"],
      rationale: "Left inferior frontal lead with contralateral frontal return for IFG-left orientation."
    },
    {
      id: "tdcs_f8_fp1",
      mode: "tdcs",
      label: "F8 -> Fp1",
      active: [
        { name: "F8", role: "anode" },
        { name: "Fp1", role: "cathode" }
      ],
      targets: ["ifg_right"],
      rationale: "Right inferior frontal lead with contralateral frontal return for IFG-right orientation."
    },
    {
      id: "tdcs_t7_fp2",
      mode: "tdcs",
      label: "T7 -> Fp2",
      active: [
        { name: "T7", role: "anode" },
        { name: "Fp2", role: "cathode" }
      ],
      targets: ["tpj_left"],
      rationale: "Temporal-parietal left lead with frontal return for TPJ-left educational approximation."
    },
    {
      id: "tdcs_t8_fp1",
      mode: "tdcs",
      label: "T8 -> Fp1",
      active: [
        { name: "T8", role: "anode" },
        { name: "Fp1", role: "cathode" }
      ],
      targets: ["tpj_right"],
      rationale: "Temporal-parietal right lead with frontal return for TPJ-right educational approximation."
    },
    {
      id: "tdcs_p3_fp2",
      mode: "tdcs",
      label: "P3 -> Fp2",
      active: [
        { name: "P3", role: "anode" },
        { name: "Fp2", role: "cathode" }
      ],
      targets: ["ppc_left"],
      rationale: "Parietal-left lead with frontal return to visualize posterior-lateral emphasis."
    },
    {
      id: "tdcs_p4_fp1",
      mode: "tdcs",
      label: "P4 -> Fp1",
      active: [
        { name: "P4", role: "anode" },
        { name: "Fp1", role: "cathode" }
      ],
      targets: ["ppc_right"],
      rationale: "Parietal-right lead with frontal return to visualize posterior-lateral emphasis."
    },
    {
      id: "tdcs_cz_oz",
      mode: "tdcs",
      label: "Cz -> Oz",
      active: [
        { name: "Cz", role: "anode" },
        { name: "Oz", role: "cathode" }
      ],
      targets: ["sma"],
      rationale: "Midline central lead with occipital return for SMA-like midline approximation."
    },
    {
      id: "tdcs_oz_fz",
      mode: "tdcs",
      label: "Oz -> Fz",
      active: [
        { name: "Oz", role: "anode" },
        { name: "Fz", role: "cathode" }
      ],
      targets: ["v1"],
      rationale: "Occipital lead with frontal return to bias posterior visual cortex area."
    },
    {
      id: "hd_f3_ring",
      mode: "hd",
      label: "Center F3 / ring AF3-F7-FC1-Fz",
      active: [
        { name: "F3", role: "center" },
        { name: "AF3", role: "return" },
        { name: "F7", role: "return" },
        { name: "FC1", role: "return" },
        { name: "Fz", role: "return" }
      ],
      targets: ["dlpfc_left"],
      rationale: "4x1 ring around left frontal center to visually concentrate field near F3."
    },
    {
      id: "hd_f4_ring",
      mode: "hd",
      label: "Center F4 / ring AF4-F8-FC2-Fz",
      active: [
        { name: "F4", role: "center" },
        { name: "AF4", role: "return" },
        { name: "F8", role: "return" },
        { name: "FC2", role: "return" },
        { name: "Fz", role: "return" }
      ],
      targets: ["dlpfc_right"],
      rationale: "4x1 ring around right frontal center to visually concentrate field near F4."
    },
    {
      id: "hd_c3_ring",
      mode: "hd",
      label: "Center C3 / ring FC1-T7-CP1-Cz",
      active: [
        { name: "C3", role: "center" },
        { name: "FC1", role: "return" },
        { name: "T7", role: "return" },
        { name: "CP1", role: "return" },
        { name: "Cz", role: "return" }
      ],
      targets: ["m1_left"],
      rationale: "4x1 ring around C3 to represent left motor-focused HD montage."
    },
    {
      id: "hd_c4_ring",
      mode: "hd",
      label: "Center C4 / ring FC2-T8-CP2-Cz",
      active: [
        { name: "C4", role: "center" },
        { name: "FC2", role: "return" },
        { name: "T8", role: "return" },
        { name: "CP2", role: "return" },
        { name: "Cz", role: "return" }
      ],
      targets: ["m1_right"],
      rationale: "4x1 ring around C4 to represent right motor-focused HD montage."
    },
    {
      id: "hd_fpz_ring",
      mode: "hd",
      label: "Center Fpz / ring AF3-AF4-F3-F4",
      active: [
        { name: "Fpz", role: "center" },
        { name: "AF3", role: "return" },
        { name: "AF4", role: "return" },
        { name: "F3", role: "return" },
        { name: "F4", role: "return" }
      ],
      targets: ["vmpfc"],
      rationale: "Midline frontal center with symmetric ring for vmPFC-oriented educational montage."
    },
    {
      id: "hd_fp1_ring",
      mode: "hd",
      label: "Center Fp1 / ring AF3-F3-F7-Fz",
      active: [
        { name: "Fp1", role: "center" },
        { name: "AF3", role: "return" },
        { name: "F3", role: "return" },
        { name: "F7", role: "return" },
        { name: "Fz", role: "return" }
      ],
      targets: ["ofc_left"],
      rationale: "Left orbitofrontal center with local frontal ring for OFC-left approximation."
    },
    {
      id: "hd_fp2_ring",
      mode: "hd",
      label: "Center Fp2 / ring AF4-F4-F8-Fz",
      active: [
        { name: "Fp2", role: "center" },
        { name: "AF4", role: "return" },
        { name: "F4", role: "return" },
        { name: "F8", role: "return" },
        { name: "Fz", role: "return" }
      ],
      targets: ["ofc_right"],
      rationale: "Right orbitofrontal center with local frontal ring for OFC-right approximation."
    },
    {
      id: "hd_f7_ring",
      mode: "hd",
      label: "Center F7 / ring Fp1-F3-FC1-T7",
      active: [
        { name: "F7", role: "center" },
        { name: "Fp1", role: "return" },
        { name: "F3", role: "return" },
        { name: "FC1", role: "return" },
        { name: "T7", role: "return" }
      ],
      targets: ["ifg_left"],
      rationale: "Lateral frontal center with nearby ring for IFG-left visual focus."
    },
    {
      id: "hd_f8_ring",
      mode: "hd",
      label: "Center F8 / ring Fp2-F4-FC2-T8",
      active: [
        { name: "F8", role: "center" },
        { name: "Fp2", role: "return" },
        { name: "F4", role: "return" },
        { name: "FC2", role: "return" },
        { name: "T8", role: "return" }
      ],
      targets: ["ifg_right"],
      rationale: "Lateral frontal center with nearby ring for IFG-right visual focus."
    },
    {
      id: "hd_t7_ring",
      mode: "hd",
      label: "Center T7 / ring F7-C3-CP1-P3",
      active: [
        { name: "T7", role: "center" },
        { name: "F7", role: "return" },
        { name: "C3", role: "return" },
        { name: "CP1", role: "return" },
        { name: "P3", role: "return" }
      ],
      targets: ["tpj_left"],
      rationale: "Lateral temporal center with perisylvian ring for TPJ-left approximation."
    },
    {
      id: "hd_t8_ring",
      mode: "hd",
      label: "Center T8 / ring F8-C4-CP2-P4",
      active: [
        { name: "T8", role: "center" },
        { name: "F8", role: "return" },
        { name: "C4", role: "return" },
        { name: "CP2", role: "return" },
        { name: "P4", role: "return" }
      ],
      targets: ["tpj_right"],
      rationale: "Lateral temporal center with perisylvian ring for TPJ-right approximation."
    },
    {
      id: "hd_p3_ring",
      mode: "hd",
      label: "Center P3 / ring C3-CP1-Pz-O1",
      active: [
        { name: "P3", role: "center" },
        { name: "C3", role: "return" },
        { name: "CP1", role: "return" },
        { name: "Pz", role: "return" },
        { name: "O1", role: "return" }
      ],
      targets: ["ppc_left"],
      rationale: "Parietal-left center with surrounding posterior ring for PPC-left visualization."
    },
    {
      id: "hd_p4_ring",
      mode: "hd",
      label: "Center P4 / ring C4-CP2-Pz-O2",
      active: [
        { name: "P4", role: "center" },
        { name: "C4", role: "return" },
        { name: "CP2", role: "return" },
        { name: "Pz", role: "return" },
        { name: "O2", role: "return" }
      ],
      targets: ["ppc_right"],
      rationale: "Parietal-right center with surrounding posterior ring for PPC-right visualization."
    },
    {
      id: "hd_cz_ring",
      mode: "hd",
      label: "Center Cz / ring FC1-FC2-CP1-CP2",
      active: [
        { name: "Cz", role: "center" },
        { name: "FC1", role: "return" },
        { name: "FC2", role: "return" },
        { name: "CP1", role: "return" },
        { name: "CP2", role: "return" }
      ],
      targets: ["sma"],
      rationale: "Midline center with symmetric surrounding returns for SMA-like educational focus."
    },
    {
      id: "hd_oz_ring",
      mode: "hd",
      label: "Center Oz / ring O1-O2-P3-P4",
      active: [
        { name: "Oz", role: "center" },
        { name: "O1", role: "return" },
        { name: "O2", role: "return" },
        { name: "P3", role: "return" },
        { name: "P4", role: "return" }
      ],
      targets: ["v1"],
      rationale: "Occipital center with posterior ring to represent V1-focused HD-tDCS layout."
    }
  ];

  var state = {
    mode: "tdcs",
    targetId: TARGETS[0].id,
    intent: "stimulate",
    intensity: 0.82,
    selectedMontageId: null,
    suggestions: [],
    showScalp: true
  };

  var ui = {
    modeSelect: document.getElementById("modeSelect"),
    targetSelect: document.getElementById("targetSelect"),
    intentSelect: document.getElementById("intentSelect"),
    intensityRange: document.getElementById("intensityRange"),
    intensityValue: document.getElementById("intensityValue"),
    generateBtn: document.getElementById("generateBtn"),
    resetCameraBtn: document.getElementById("resetCameraBtn"),
    toggleScalpBtn: document.getElementById("toggleScalpBtn"),
    montageList: document.getElementById("montageList"),
    sceneContainer: document.getElementById("scene3d"),
    capCanvas: document.getElementById("capCanvas"),
    infoTarget: document.getElementById("infoTarget"),
    infoHemisphere: document.getElementById("infoHemisphere"),
    infoMode: document.getElementById("infoMode"),
    infoElectrodes: document.getElementById("infoElectrodes"),
    infoPolarity: document.getElementById("infoPolarity"),
    infoRationale: document.getElementById("infoRationale")
  };

  var scene;
  var camera;
  var renderer;
  var controls;
  var brainMesh;
  var brainGeometry;
  var scalpMesh;
  var electrodeGroup;
  var activeElectrodeGroup;
  var targetMarker;
  var capCtx = ui.capCanvas.getContext("2d");
  var activeCache = [];

  var CYLINDER_GEOMETRY = new THREE.CylinderBufferGeometry(0.052, 0.052, 0.03, 24);
  var BASE_ELECTRODE_GEOMETRY = new THREE.SphereBufferGeometry(0.018, 10, 10);
  var TARGET_GEOMETRY = new THREE.SphereBufferGeometry(0.058, 22, 22);

  var COLOR_NEUTRAL = [0.64, 0.69, 0.75];
  var COLOR_COOL = [0.27, 0.59, 1.0];
  var COLOR_WARM = [1.0, 0.49, 0.18];
  var COLOR_HOT = [1.0, 0.86, 0.30];

  init();

  function init() {
    populateTargetSelect();
    initScene();
    bindEvents();
    refreshSuggestions(false);
    updateIntensityOutput();
    onResize();
    animate();
  }

  function populateTargetSelect() {
    TARGETS.forEach(function (target) {
      var option = document.createElement("option");
      option.value = target.id;
      option.textContent = target.name;
      ui.targetSelect.appendChild(option);
    });
    ui.targetSelect.value = state.targetId;
  }

  function bindEvents() {
    ui.modeSelect.addEventListener("change", function () {
      state.mode = ui.modeSelect.value;
      refreshSuggestions(false);
    });

    ui.targetSelect.addEventListener("change", function () {
      state.targetId = ui.targetSelect.value;
      refreshSuggestions(false);
    });

    ui.intentSelect.addEventListener("change", function () {
      state.intent = ui.intentSelect.value;
      renderAll();
    });

    ui.intensityRange.addEventListener("input", function () {
      var raw = Number(ui.intensityRange.value) / 100;
      state.intensity = clamp(raw, VISUAL.minIntensity, VISUAL.maxIntensity);
      updateIntensityOutput();
      renderAll();
    });

    ui.generateBtn.addEventListener("click", function () {
      refreshSuggestions(true);
    });

    ui.resetCameraBtn.addEventListener("click", function () {
      camera.position.set(0, 1.55, 2.8);
      controls.target.set(0, 0.12, 0);
      controls.update();
    });

    ui.toggleScalpBtn.addEventListener("click", function () {
      state.showScalp = !state.showScalp;
      ui.toggleScalpBtn.textContent = state.showScalp ? "Hide Scalp" : "Show Scalp";
      renderAll();
    });

    window.addEventListener("resize", onResize);
  }

  function refreshSuggestions(cycleSelection) {
    var compatible = getCompatibleMontages(state.targetId, state.mode);
    state.suggestions = compatible;

    if (!compatible.length) {
      state.selectedMontageId = null;
    } else if (cycleSelection && state.selectedMontageId) {
      var currentIdx = compatible.findIndex(function (montage) {
        return montage.id === state.selectedMontageId;
      });
      var nextIdx = currentIdx >= 0 ? (currentIdx + 1) % compatible.length : 0;
      state.selectedMontageId = compatible[nextIdx].id;
    } else {
      var stillAvailable = compatible.some(function (montage) {
        return montage.id === state.selectedMontageId;
      });
      if (!stillAvailable) {
        state.selectedMontageId = compatible[0].id;
      }
    }

    renderMontageList();
    renderAll();
  }

  function getCompatibleMontages(targetId, mode) {
    var target = getTargetById(targetId);
    if (!target) {
      return [];
    }

    var preferred = target.preferredMontages
      .map(function (id) {
        return getMontageById(id);
      })
      .filter(function (montage) {
        return montage && montage.mode === mode;
      });

    var additional = MONTAGES.filter(function (montage) {
      return (
        montage.mode === mode &&
        montage.targets.indexOf(targetId) >= 0 &&
        target.preferredMontages.indexOf(montage.id) === -1
      );
    });

    return preferred.concat(additional);
  }

  function renderMontageList() {
    ui.montageList.innerHTML = "";

    if (!state.suggestions.length) {
      var empty = document.createElement("li");
      empty.textContent = "No montage found for this mode/target.";
      empty.className = "montage-item";
      ui.montageList.appendChild(empty);
      return;
    }

    state.suggestions.forEach(function (montage) {
      var item = document.createElement("li");
      var button = document.createElement("button");
      var isActive = montage.id === state.selectedMontageId;
      button.className = "montage-item" + (isActive ? " active" : "");
      button.type = "button";
      button.textContent = montage.label;
      button.addEventListener("click", function () {
        state.selectedMontageId = montage.id;
        renderMontageList();
        renderAll();
      });
      item.appendChild(button);
      ui.montageList.appendChild(item);
    });
  }

  function initScene() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.55, 2.8);

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(ui.sceneContainer.clientWidth, ui.sceneContainer.clientHeight);
      ui.sceneContainer.appendChild(renderer.domElement);
    } catch (err) {
      ui.sceneContainer.textContent = "WebGL is not available in this browser.";
      return;
    }

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.minDistance = 1.9;
    controls.maxDistance = 6.0;
    controls.target.set(0, 0.12, 0);

    scene.add(new THREE.AmbientLight(0x94b4cd, 0.52));

    var hemi = new THREE.HemisphereLight(0xb4d7ff, 0x0b1724, 0.7);
    scene.add(hemi);

    var key = new THREE.DirectionalLight(0xfff2dd, 0.95);
    key.position.set(2.7, 2.2, 1.8);
    scene.add(key);

    var rim = new THREE.DirectionalLight(0x57a4ff, 0.5);
    rim.position.set(-2.8, 1.8, -1.7);
    scene.add(rim);

    createBrain();
    createScalp();
    createElectrodeLayers();
    createTargetMarker();
  }

  function createBrain() {
    brainGeometry = new THREE.SphereBufferGeometry(VISUAL.brainRadius, 132, 96);
    var positionAttr = brainGeometry.attributes.position;
    var vertex = new THREE.Vector3();

    for (var i = 0; i < positionAttr.count; i += 1) {
      vertex.fromBufferAttribute(positionAttr, i);

      var x = vertex.x;
      var y = vertex.y;
      var z = vertex.z;
      var absX = Math.abs(x);
      var side = x >= 0 ? 1 : -1;

      // Base anatomical proportions (frontal-occipital length > superior-inferior height).
      var sx = 0.87;
      var sy = 0.78;
      var sz = 1.12;

      // Global lobe shaping.
      var frontalBulge = 0.14 * gaussian(z, 0.48, 0.30) * (1 - 0.25 * clamp(-y, 0, 1));
      var parietalBulge = 0.07 * gaussian(z, 0.08, 0.35) * (1 - 0.20 * clamp(-y, 0, 1));
      var occipitalBulge = 0.09 * gaussian(z, -0.58, 0.24);
      var temporalBulge = 0.12 * gaussian(absX, 0.62, 0.16) * gaussian(y, -0.12, 0.30);

      // Interhemispheric fissure and inferior flattening.
      var fissureDepth = -0.12 * gaussian(absX, 0.0, 0.065) * smoothstep(-0.15, 0.80, y);
      var ventralFlatten = -0.16 * smoothstep(-1.0, -0.18, y) * (1 - 0.40 * gaussian(absX, 0.0, 0.40));

      // Stylized gyri/sulci texture, reduced near the fissure.
      var lateralWeight = smoothstep(0.08, 0.82, absX) * (1 - 0.35 * smoothstep(0.65, 1.0, y));
      var sulciPattern =
        0.040 *
        Math.sin(17.0 * z + 5.0 * y + 0.7 * side) *
        Math.sin(11.0 * y + 7.0 * x) *
        lateralWeight;

      var shape =
        1.0 + frontalBulge + parietalBulge + occipitalBulge + temporalBulge + fissureDepth + ventralFlatten + sulciPattern;
      shape = clamp(shape, 0.72, 1.34);

      vertex.set(x * sx, y * sy, z * sz).normalize().multiplyScalar(VISUAL.brainRadius * shape);
      positionAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    brainGeometry.computeVertexNormals();

    var colors = new Float32Array(positionAttr.count * 3);
    for (var c = 0; c < positionAttr.count; c += 1) {
      colors[c * 3] = COLOR_NEUTRAL[0];
      colors[c * 3 + 1] = COLOR_NEUTRAL[1];
      colors[c * 3 + 2] = COLOR_NEUTRAL[2];
    }
    brainGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    var material = new THREE.MeshPhongMaterial({
      vertexColors: true,
      shininess: 26,
      specular: new THREE.Color(0x345067),
      transparent: true,
      opacity: 0.98
    });

    brainMesh = new THREE.Mesh(brainGeometry, material);
    scene.add(brainMesh);

    // Extra anatomical cues so the object reads as a brain, not a sphere.
    var cerebellumGeometry = new THREE.SphereBufferGeometry(0.40, 44, 30);
    var cerebellumPosition = cerebellumGeometry.attributes.position;
    for (var j = 0; j < cerebellumPosition.count; j += 1) {
      vertex.fromBufferAttribute(cerebellumPosition, j);
      var ripple = 1 + 0.08 * Math.sin(vertex.x * 14.0) * Math.cos(vertex.y * 11.0);
      vertex.set(vertex.x * 1.05, vertex.y * 0.72, vertex.z * 0.82).multiplyScalar(ripple);
      cerebellumPosition.setXYZ(j, vertex.x, vertex.y, vertex.z);
    }
    cerebellumGeometry.computeVertexNormals();

    var cerebellum = new THREE.Mesh(
      cerebellumGeometry,
      new THREE.MeshPhongMaterial({
        color: 0x8f9eb2,
        emissive: 0x0a0f14,
        shininess: 18,
        transparent: true,
        opacity: 0.82
      })
    );
    cerebellum.position.set(0, -0.33, -0.72);
    scene.add(cerebellum);

    var stem = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(0.14, 0.11, 0.26, 24),
      new THREE.MeshPhongMaterial({
        color: 0x7d8ea4,
        emissive: 0x090f16,
        shininess: 16,
        transparent: true,
        opacity: 0.78
      })
    );
    stem.position.set(0, -0.65, -0.30);
    stem.rotation.x = -0.22;
    scene.add(stem);
  }

  function createScalp() {
    var scalpGeometry = new THREE.SphereBufferGeometry(VISUAL.scalpRadius, 66, 52);
    var scalpMaterial = new THREE.MeshPhongMaterial({
      color: 0x6f95b3,
      transparent: true,
      opacity: 0.17,
      side: THREE.DoubleSide,
      shininess: 10
    });
    scalpMesh = new THREE.Mesh(scalpGeometry, scalpMaterial);
    scene.add(scalpMesh);
  }

  function createElectrodeLayers() {
    electrodeGroup = new THREE.Group();
    activeElectrodeGroup = new THREE.Group();

    var baseMat = new THREE.MeshPhongMaterial({ color: 0x8fa8be, transparent: true, opacity: 0.72 });

    Object.keys(ELECTRODES).forEach(function (name) {
      var e = ELECTRODES[name];
      var marker = new THREE.Mesh(BASE_ELECTRODE_GEOMETRY, baseMat);
      marker.position.copy(e.scalp3D.clone().multiplyScalar(VISUAL.scalpRadius * 1.003));
      electrodeGroup.add(marker);
    });

    scene.add(electrodeGroup);
    scene.add(activeElectrodeGroup);
  }

  function createTargetMarker() {
    var markerMat = new THREE.MeshPhongMaterial({
      color: 0xff9c4b,
      emissive: 0x201208,
      shininess: 35
    });
    targetMarker = new THREE.Mesh(TARGET_GEOMETRY, markerMat);
    scene.add(targetMarker);
  }

  function renderAll() {
    var montage = getSelectedMontage();
    activeCache = resolveActiveElectrodes(montage);
    updateTargetMarker();
    updateInfluenceMap(activeCache);
    updateActiveElectrodes(activeCache);
    drawCapView(activeCache);
    updateInfoPanel(montage, activeCache);

    if (scalpMesh) {
      scalpMesh.visible = state.showScalp;
    }
  }

  function updateTargetMarker() {
    var target = getTargetById(state.targetId);
    if (!target || !targetMarker) {
      return;
    }

    targetMarker.position.set(target.brainCoord.x, target.brainCoord.y, target.brainCoord.z);
    if (state.intent === "stimulate") {
      targetMarker.material.color.setHex(0xffa24d);
      targetMarker.material.emissive.setHex(0x2a1608);
    } else {
      targetMarker.material.color.setHex(0x5a98ff);
      targetMarker.material.emissive.setHex(0x091833);
    }
  }

  function updateInfluenceMap(activeElectrodes) {
    if (!brainGeometry) {
      return;
    }

    var positionAttr = brainGeometry.attributes.position;
    var colorAttr = brainGeometry.attributes.color;
    var target = getTargetById(state.targetId);

    var targetDir = new THREE.Vector3();
    if (target) {
      targetDir.set(target.brainCoord.x, target.brainCoord.y, target.brainCoord.z).normalize();
    }

    var vertex = new THREE.Vector3();
    var electrodeDir = new THREE.Vector3();
    var sigma = state.mode === "hd" ? VISUAL.hdSigma : VISUAL.tdcsSigma;
    var values = new Float32Array(positionAttr.count);
    var maxAbs = 0;
    var intentSign = state.intent === "stimulate" ? 1 : -1;

    // Heuristic influence model: signed gaussian decay over the cortical surface.
    for (var i = 0; i < positionAttr.count; i += 1) {
      vertex.fromBufferAttribute(positionAttr, i).normalize();
      var value = 0;

      for (var j = 0; j < activeElectrodes.length; j += 1) {
        electrodeDir.copy(activeElectrodes[j].position).normalize();
        var angular = 1 - vertex.dot(electrodeDir);
        var gauss = Math.exp(-(angular * angular) / (2 * sigma * sigma));
        value += activeElectrodes[j].weight * gauss;
      }

      if (target) {
        var focusDistance = vertex.distanceTo(targetDir);
        var focus = Math.exp(-(focusDistance * focusDistance) / (2 * 0.36 * 0.36));
        value += intentSign * 0.16 * focus;
      }

      values[i] = value;
      if (Math.abs(value) > maxAbs) {
        maxAbs = Math.abs(value);
      }
    }

    var denom = maxAbs || 1;
    for (var k = 0; k < values.length; k += 1) {
      var normalized = clamp(values[k] / denom, -1, 1) * state.intensity;
      var rgb = valueToRGB(normalized);
      colorAttr.setXYZ(k, rgb[0], rgb[1], rgb[2]);
    }
    colorAttr.needsUpdate = true;
  }

  function updateActiveElectrodes(activeElectrodes) {
    if (!activeElectrodeGroup) {
      return;
    }

    while (activeElectrodeGroup.children.length) {
      activeElectrodeGroup.remove(activeElectrodeGroup.children[0]);
    }

    var up = new THREE.Vector3(0, 1, 0);

    for (var i = 0; i < activeElectrodes.length; i += 1) {
      var e = activeElectrodes[i];
      var weightSign = e.weight >= 0 ? 1 : -1;
      var color = weightSign >= 0 ? 0xff9e48 : 0x4f98ff;
      var material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: weightSign >= 0 ? 0x2e1406 : 0x091939,
        shininess: 34
      });

      var marker = new THREE.Mesh(CYLINDER_GEOMETRY, material);
      var normal = e.position.clone().normalize();
      var q = new THREE.Quaternion().setFromUnitVectors(up, normal);
      marker.quaternion.copy(q);
      marker.position.copy(normal.multiplyScalar(VISUAL.scalpRadius * 1.03));

      activeElectrodeGroup.add(marker);

      var halo = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.028, 14, 14),
        new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.9 })
      );
      halo.position.copy(e.position.clone().normalize().multiplyScalar(VISUAL.scalpRadius * 1.05));
      activeElectrodeGroup.add(halo);
    }
  }

  function resolveActiveElectrodes(montage) {
    if (!montage) {
      return [];
    }

    return montage.active
      .map(function (entry) {
        var electrode = ELECTRODES[entry.name];
        if (!electrode) {
          return null;
        }

        var effectiveRole = applyIntentRole(entry.role, state.intent);
        return {
          name: entry.name,
          role: entry.role,
          effectiveRole: effectiveRole,
          weight: roleToWeight(effectiveRole),
          position: electrode.scalp3D.clone().multiplyScalar(VISUAL.scalpRadius)
        };
      })
      .filter(Boolean);
  }

  function drawCapView(activeElectrodes) {
    resizeCanvasToDisplaySize(ui.capCanvas);
    var ctx = capCtx;
    var w = ui.capCanvas.width;
    var h = ui.capCanvas.height;

    ctx.clearRect(0, 0, w, h);

    var cx = w * 0.50;
    var cy = h * 0.52;
    var radius = Math.min(w, h) * 0.40;

    drawCapBackground(ctx, cx, cy, radius);

    var activeMap = {};
    activeElectrodes.forEach(function (e) {
      activeMap[e.name] = e;
    });

    Object.keys(ELECTRODES).forEach(function (name) {
      var electrode = ELECTRODES[name];
      var pos = capToPixels(electrode.cap2D, cx, cy, radius);
      var isActive = !!activeMap[name];
      var active = activeMap[name];

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, isActive ? 7 : 4.1, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? (active.weight >= 0 ? "#ff8d3a" : "#4f9dff") : "#8ca2b8";
      ctx.fill();

      if (isActive) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(245, 250, 255, 0.95)";
        ctx.stroke();

        ctx.font = "bold 11px 'Trebuchet MS', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(roleMarker(active.effectiveRole), pos.x + 8, pos.y - 8);
      }

      ctx.font = "11px 'Trebuchet MS', sans-serif";
      ctx.fillStyle = "#dceafe";
      ctx.fillText(name, pos.x + 6, pos.y + 13);
    });
  }

  function drawCapBackground(ctx, cx, cy, radius) {
    var grad = ctx.createRadialGradient(cx, cy - radius * 0.28, radius * 0.2, cx, cy, radius * 1.15);
    grad.addColorStop(0, "rgba(30, 62, 90, 0.95)");
    grad.addColorStop(1, "rgba(8, 18, 28, 0.98)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(186, 210, 233, 0.5)";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - 16, cy - radius - 2);
    ctx.lineTo(cx, cy - radius - 23);
    ctx.lineTo(cx + 16, cy - radius - 2);
    ctx.strokeStyle = "rgba(186, 210, 233, 0.58)";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx - radius - 6, cy, 9, -1.2, 1.2);
    ctx.arc(cx + radius + 6, cy, 9, 1.95, 4.35);
    ctx.strokeStyle = "rgba(186, 210, 233, 0.34)";
    ctx.stroke();
  }

  function updateInfoPanel(montage, activeElectrodes) {
    var target = getTargetById(state.targetId);

    ui.infoTarget.textContent = target ? target.name : "-";
    ui.infoHemisphere.textContent = target ? capitalize(target.hemisphere) : "-";
    ui.infoMode.textContent = state.mode === "tdcs" ? "tDCS Standard" : "HD-tDCS 4x1";

    if (!montage) {
      ui.infoElectrodes.textContent = "No compatible montage";
      ui.infoPolarity.textContent = "-";
      ui.infoRationale.textContent = "Pick another mode/target combination.";
      return;
    }

    ui.infoElectrodes.textContent = activeElectrodes
      .map(function (entry) {
        return entry.name + " (" + roleLabel(entry.effectiveRole) + ")";
      })
      .join(", ");

    ui.infoPolarity.textContent =
      state.intent === "stimulate"
        ? "Warm-positive emphasis on center/lead electrode"
        : "Cold-negative emphasis after visual polarity inversion";

    ui.infoRationale.textContent = montage.rationale;
  }

  function animate() {
    requestAnimationFrame(animate);
    if (controls) {
      controls.update();
    }
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function onResize() {
    if (renderer && camera) {
      var width = Math.max(40, ui.sceneContainer.clientWidth);
      var height = Math.max(260, ui.sceneContainer.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    drawCapView(activeCache);
  }

  function buildElectrodes(map) {
    var out = {};
    Object.keys(map).forEach(function (name) {
      var cap = map[name];
      var projected = capToSphere(cap.x, cap.y);
      out[name] = {
        label: name,
        cap2D: { x: cap.x, y: cap.y },
        scalp3D: projected
      };
    });
    return out;
  }

  function capToSphere(x, y) {
    var z = -y;
    var xx = x;
    var yy = Math.sqrt(Math.max(0, 1 - xx * xx - z * z));
    return new THREE.Vector3(xx, yy, z);
  }

  function capToPixels(cap, cx, cy, radius) {
    return {
      x: cx + cap.x * radius,
      y: cy + cap.y * radius
    };
  }

  function applyIntentRole(role, intent) {
    if (intent === "stimulate") {
      return role;
    }

    if (role === "anode") {
      return "cathode";
    }
    if (role === "cathode") {
      return "anode";
    }
    if (role === "center") {
      return "return";
    }
    if (role === "return") {
      return "center";
    }
    return role;
  }

  function roleToWeight(role) {
    if (role === "anode") {
      return 1;
    }
    if (role === "cathode") {
      return -1;
    }
    if (role === "center") {
      return 1;
    }
    if (role === "return") {
      return VISUAL.returnWeight;
    }
    return 0;
  }

  function roleMarker(role) {
    if (role === "anode") {
      return "+";
    }
    if (role === "cathode") {
      return "-";
    }
    if (role === "center") {
      return "C";
    }
    if (role === "return") {
      return "R";
    }
    return "?";
  }

  function roleLabel(role) {
    if (role === "anode") {
      return "anode";
    }
    if (role === "cathode") {
      return "cathode";
    }
    if (role === "center") {
      return "center";
    }
    if (role === "return") {
      return "return";
    }
    return role;
  }

  function valueToRGB(value) {
    var v = clamp(value, -1, 1);
    var t;

    if (v >= 0) {
      if (v < 0.6) {
        t = v / 0.6;
        return lerpColor(COLOR_NEUTRAL, COLOR_WARM, t);
      }
      t = (v - 0.6) / 0.4;
      return lerpColor(COLOR_WARM, COLOR_HOT, t);
    }

    t = Math.abs(v);
    return lerpColor(COLOR_NEUTRAL, COLOR_COOL, t);
  }

  function lerpColor(from, to, t) {
    var tt = clamp(t, 0, 1);
    return [
      from[0] + (to[0] - from[0]) * tt,
      from[1] + (to[1] - from[1]) * tt,
      from[2] + (to[2] - from[2]) * tt
    ];
  }

  function getSelectedMontage() {
    return getMontageById(state.selectedMontageId);
  }

  function getMontageById(id) {
    for (var i = 0; i < MONTAGES.length; i += 1) {
      if (MONTAGES[i].id === id) {
        return MONTAGES[i];
      }
    }
    return null;
  }

  function getTargetById(id) {
    for (var i = 0; i < TARGETS.length; i += 1) {
      if (TARGETS[i].id === id) {
        return TARGETS[i];
      }
    }
    return null;
  }

  function updateIntensityOutput() {
    ui.intensityValue.textContent = Math.round(state.intensity * 100) + "%";
  }

  function gaussian(value, center, sigma) {
    var d = value - center;
    return Math.exp(-(d * d) / (2 * sigma * sigma));
  }

  function smoothstep(edge0, edge1, x) {
    var t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function capitalize(text) {
    if (!text) {
      return text;
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function resizeCanvasToDisplaySize(canvas) {
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    var displayWidth = Math.max(220, canvas.clientWidth);
    var displayHeight = Math.max(220, canvas.clientHeight);
    var width = Math.floor(displayWidth * ratio);
    var height = Math.floor(displayHeight * ratio);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }
})();
