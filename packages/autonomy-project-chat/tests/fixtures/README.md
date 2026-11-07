# Synthetic legacy Office fixtures

These contain only generated Chinese test text, two slide notes, and a cell formula. They do not contain user documents. Created with python-pptx/openpyxl and converted with the bundled headless LibreOffice for compatibility testing.

- `legacy-slides.ppt`: two slides titled 中文测试第1页 / 中文测试第2页, body 资料正文1 / 资料正文2, and notes 备注说明1 / 备注说明2.
- `legacy-table.xls`: worksheet 中文资料, A1 中文单元格, B1 42, C1 formula B1+1 and cached value 43.

The separate in-code PPT fixture exercises incremental save references and deleted content, which these ordinary converted files do not test.
