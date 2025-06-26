import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Alert,
} from '@mui/material';
import { 
  Print as PrintIcon,
  GetApp as ExportIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  TableChart as ExcelIcon,
} from '@mui/icons-material';

interface GanttExportDialogProps {
  open: boolean;
  onClose: () => void;
  projectName?: string;
}

export const GanttExportDialog: React.FC<GanttExportDialogProps> = ({
  open,
  onClose,
  projectName = 'プロジェクト',
}) => {
  const [exportType, setExportType] = React.useState<'pdf' | 'png' | 'excel' | 'print'>('pdf');
  const [pageSize, setPageSize] = React.useState<'A4' | 'A3' | 'Letter'>('A4');
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>('landscape');
  const [includeTaskDetails, setIncludeTaskDetails] = React.useState(true);
  const [includeProgress, setIncludeProgress] = React.useState(true);
  const [includeAssignees, setIncludeAssignees] = React.useState(true);
  const [includeDates, setIncludeDates] = React.useState(true);
  const [dateRange, setDateRange] = React.useState<'visible' | 'all' | 'custom'>('visible');

  const handleExport = () => {
    console.log('エクスポート実行:', {
      type: exportType,
      pageSize,
      orientation,
      options: {
        includeTaskDetails,
        includeProgress,
        includeAssignees,
        includeDates,
        dateRange,
      },
    });

    // TODO: 実際のエクスポート処理を実装
    switch (exportType) {
      case 'print':
        handlePrint();
        break;
      case 'pdf':
        handlePdfExport();
        break;
      case 'png':
        handleImageExport();
        break;
      case 'excel':
        handleExcelExport();
        break;
    }
    
    onClose();
  };

  const handlePrint = () => {
    // ブラウザの印刷機能を使用
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${projectName} - ガントチャート</title>
            <style>
              body { font-family: 'Arial', sans-serif; margin: 20px; }
              h1 { color: #333; text-align: center; }
              .gantt-container { width: 100%; }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <h1>${projectName} - ガントチャート</h1>
            <div class="gantt-container">
              <p>印刷機能は開発中です。実際の実装では、ガントチャートのSVGまたはCanvasを生成して印刷用に最適化します。</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handlePdfExport = () => {
    // TODO: jsPDFやhtml2canvasを使用してPDF生成
    alert('PDF エクスポート機能は開発中です。\n実装予定:\n- jsPDF/html2canvas でガントチャート画像化\n- 複数ページ対応\n- カスタムレイアウト');
  };

  const handleImageExport = () => {
    // TODO: html2canvasを使用して画像生成
    alert('画像エクスポート機能は開発中です。\n実装予定:\n- html2canvas でPNG/JPEG生成\n- 高解像度出力対応\n- 透明背景オプション');
  };

  const handleExcelExport = () => {
    // TODO: SheetJSを使用してExcel生成
    alert('Excel エクスポート機能は開発中です。\n実装予定:\n- タスク一覧の表形式出力\n- ガントチャート画像埋め込み\n- プロジェクト統計情報');
  };

  const getExportIcon = () => {
    switch (exportType) {
      case 'pdf': return <PdfIcon />;
      case 'png': return <ImageIcon />;
      case 'excel': return <ExcelIcon />;
      case 'print': return <PrintIcon />;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ExportIcon />
        ガントチャート エクスポート
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          {projectName} のガントチャートをエクスポートまたは印刷します。
        </Alert>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* エクスポート形式 */}
          <Box>
            <Typography variant="h6" gutterBottom>
              エクスポート形式
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup 
                value={exportType} 
                onChange={(e) => setExportType(e.target.value as 'pdf' | 'png' | 'excel' | 'print')}
                row
              >
                <FormControlLabel 
                  value="pdf" 
                  control={<Radio />} 
                  label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><PdfIcon fontSize="small" />PDF</Box>} 
                />
                <FormControlLabel 
                  value="png" 
                  control={<Radio />} 
                  label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><ImageIcon fontSize="small" />PNG画像</Box>} 
                />
                <FormControlLabel 
                  value="excel" 
                  control={<Radio />} 
                  label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><ExcelIcon fontSize="small" />Excel</Box>} 
                />
                <FormControlLabel 
                  value="print" 
                  control={<Radio />} 
                  label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><PrintIcon fontSize="small" />印刷</Box>} 
                />
              </RadioGroup>
            </FormControl>
          </Box>

          {/* ページ設定 */}
          {(exportType === 'pdf' || exportType === 'print') && (
            <>
              <Box sx={{ display: 'inline-block', width: '50%', pr: 1 }}>
                <FormControl fullWidth>
                  <InputLabel>用紙サイズ</InputLabel>
                  <Select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as 'A4' | 'A3' | 'Letter')}
                    label="用紙サイズ"
                  >
                    <MenuItem value="A4">A4</MenuItem>
                    <MenuItem value="A3">A3</MenuItem>
                    <MenuItem value="Letter">Letter</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'inline-block', width: '50%', pr: 1 }}>
                <FormControl fullWidth>
                  <InputLabel>向き</InputLabel>
                  <Select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
                    label="向き"
                  >
                    <MenuItem value="portrait">縦向き</MenuItem>
                    <MenuItem value="landscape">横向き（推奨）</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </>
          )}

          {/* 含める情報 */}
          <Box>
            <Typography variant="h6" gutterBottom>
              含める情報
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeTaskDetails}
                    onChange={(e) => setIncludeTaskDetails(e.target.checked)}
                  />
                }
                label="タスク詳細（説明、タグ）"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeProgress}
                    onChange={(e) => setIncludeProgress(e.target.checked)}
                  />
                }
                label="進捗状況"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeAssignees}
                    onChange={(e) => setIncludeAssignees(e.target.checked)}
                  />
                }
                label="担当者"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeDates}
                    onChange={(e) => setIncludeDates(e.target.checked)}
                  />
                }
                label="開始・終了日"
              />
            </Box>
          </Box>

          {/* 日付範囲 */}
          <Box>
            <Typography variant="h6" gutterBottom>
              日付範囲
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value as 'visible' | 'all' | 'custom')}
              >
                <FormControlLabel value="visible" control={<Radio />} label="現在表示中の範囲" />
                <FormControlLabel value="all" control={<Radio />} label="全期間" />
                <FormControlLabel value="custom" control={<Radio />} label="カスタム範囲（開発予定）" disabled />
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          キャンセル
        </Button>
        <Button 
          onClick={handleExport} 
          variant="contained" 
          startIcon={getExportIcon()}
        >
          {exportType === 'print' ? '印刷' : 'エクスポート'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};