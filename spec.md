# Dynamic Power Systems Field Reports

## Current State
Multi-step service report form with 6 steps: Job Info, Equipment, Service, Parts, Checklist, Finalize. PDF export via PrintReport component. Signature block in PDF is static (name + line only).

## Requested Changes (Diff)

### Add
- Step 5.5 (new step between Checklist and Finalize): "Voltage Readings" -- record at least 4 labeled voltage readings (e.g. Input Voltage R, Input Voltage Y, Input Voltage B, Output Voltage)
- Each voltage reading has: label (editable) and value (numeric, in Volts)
- Engineer can add more readings beyond the 4 defaults
- Signature step at the end: engineer draws/types signature and client draws/types signature
- Two canvas-based signature pads (engineer + client) using mouse/touch
- Clear signature button for each pad
- Voltage readings section rendered in PDF
- Actual signature images rendered in PDF

### Modify
- STEPS array: insert new "Voltage" step (becomes step 6), shift Finalize to step 7
- ServiceReport form state: add voltageReadings array and engineerSignature/clientSignature (base64 strings)
- PrintReport: add Voltage Readings section table and render signature images in signature block
- Step 7 (Finalize/Review): show voltage readings count and signature status in summary

### Remove
- Nothing removed

## Implementation Plan
1. Update CreateReport.tsx: add STEPS entry for Voltage and Signatures, add form state for voltageReadings, engineerSignatureData, clientSignatureData
2. Build Step6 (VoltageReadings): table with 4 default rows (label + value), add/remove row buttons
3. Build Step7 (Signatures): two canvas signature pads side by side with clear buttons, also show updated Finalize review content
4. Move old Step6 (Finalize) to Step8, or merge signatures into last step
5. Update PrintReport.tsx: add Voltage Readings section, replace static signature lines with actual signature images (if captured)
