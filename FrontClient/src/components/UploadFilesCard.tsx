import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import { Alert, Box, Button, LinearProgress, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, useMemo, useState } from 'react';
import { ClientUploadPolicyViewModel } from '../domain/client/view-models';

interface UploadFilesCardProps {
  title: string;
  description: string;
  uploadPolicy: ClientUploadPolicyViewModel;
  ownerType: 'ORDER' | 'VEHICLE';
  ownerId: string;
  uploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
  onUpload: (params: {
    file: File;
    category: 'INSPECTION_PHOTO' | 'DOCUMENT' | 'ACT' | 'ESTIMATE';
    ownerType: 'ORDER' | 'VEHICLE';
    ownerId: string;
  }) => Promise<void>;
  onRetry: () => Promise<void>;
  onClearError: () => void;
}

const categories = [
  { value: 'INSPECTION_PHOTO', label: 'Фото' },
  { value: 'DOCUMENT', label: 'Документ' },
  { value: 'ACT', label: 'Акт' },
  { value: 'ESTIMATE', label: 'Смета' }
] as const;

export const UploadFilesCard = ({
  title,
  description,
  uploadPolicy,
  ownerType,
  ownerId,
  uploading,
  uploadProgress,
  uploadError,
  onUpload,
  onRetry,
  onClearError
}: UploadFilesCardProps) => {
  const [category, setCategory] = useState<(typeof categories)[number]['value']>('INSPECTION_PHOTO');
  const [file, setFile] = useState<File | null>(null);
  const fileLabel = useMemo(() => (file ? file.name : 'Файл пока не выбран'), [file]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    onClearError();
    setFile(nextFile);
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }
    await onUpload({ file, category, ownerType, ownerId });
    setFile(null);
  };

  return (
    <Box sx={{ p: 3, borderRadius: 5, bgcolor: 'background.paper', border: (theme) => `1px solid ${theme.palette.divider}` }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" fontWeight={800}>{title}</Typography>
          <Typography color="text.secondary">{description}</Typography>
        </Box>
        <Alert severity="info">{uploadPolicy.helperText} Поддерживаем {uploadPolicy.allowedFormatsLabel}, размер {uploadPolicy.maxFileSizeLabel}.</Alert>
        <TextField select label="Что вы добавляете" value={category} onChange={(event) => setCategory(event.target.value as typeof category)}>
          {categories.map((item) => (
            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
          ))}
        </TextField>
        <Button component="label" variant="outlined" startIcon={<CloudUploadRoundedIcon />}>
          Выбрать файл
          <input hidden type="file" accept="image/jpeg,image/png,application/pdf" onChange={handleFileChange} />
        </Button>
        <Typography variant="body2" color="text.secondary">{fileLabel}</Typography>
        {uploading ? <LinearProgress variant="determinate" value={uploadProgress} /> : null}
        {uploadError ? (
          <Alert severity="warning" action={<Button color="inherit" size="small" startIcon={<ReplayRoundedIcon />} onClick={() => void onRetry()}>Повторить</Button>}>
            {uploadError}
          </Alert>
        ) : null}
        <Button variant="contained" disabled={!file || uploading} onClick={() => void handleUpload()}>
          Загрузить до визита
        </Button>
      </Stack>
    </Box>
  );
};
