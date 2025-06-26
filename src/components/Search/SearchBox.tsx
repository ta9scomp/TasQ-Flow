import React from 'react';
import {
  Box,
  InputBase,
  alpha,
  styled,
  Chip,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grow,
  ClickAwayListener,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  ListItemSecondaryAction,
} from '@mui/material';

import {
  Search as SearchIcon,
  Person as PersonIcon,
  Tag as TagIcon,
  TrendingUp as ProgressIcon,
  Star as PriorityIcon,
  Assignment as StatusIcon,
  Speed as CapacityIcon,
  History as HistoryIcon,
  StarBorder as StarBorderIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

import { useTranslation } from '../../i18n';

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  transition: 'width 0.3s ease',
  '&:focus-within': {
    width: '400px',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

interface SearchFilter {
  type: 'member' | 'tag' | 'progress' | 'priority' | 'status' | 'capacity';
  value: string;
  label: string;
}

interface SearchHistory {
  id: string;
  query: string;
  filters: SearchFilter[];
  timestamp: Date;
  isFavorite: boolean;
  name?: string; // お気に入りの場合の名前
}

interface SearchBoxProps {
  onSearch?: (query: string, filters: SearchFilter[]) => void;
  onFiltersChange?: (filters: SearchFilter[]) => void;
  maxHistoryItems?: number;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, onFiltersChange, maxHistoryItems = 5 }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState<SearchFilter[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [historyMenuAnchor, setHistoryMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [searchHistory, setSearchHistory] = React.useState<SearchHistory[]>([]);
  const [favoriteDialogOpen, setFavoriteDialogOpen] = React.useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = React.useState<SearchHistory | null>(null);
  const [favoriteName, setFavoriteName] = React.useState('');

  const searchSuggestions = [
    { type: 'member' as const, icon: <PersonIcon fontSize="small" />, label: t('ui.search.member'), prefix: '@' },
    { type: 'tag' as const, icon: <TagIcon fontSize="small" />, label: t('ui.search.tag'), prefix: '#' },
    { type: 'progress' as const, icon: <ProgressIcon fontSize="small" />, label: t('ui.search.progress'), prefix: '%' },
    { type: 'priority' as const, icon: <PriorityIcon fontSize="small" />, label: t('ui.search.priority'), prefix: '!' },
    { type: 'status' as const, icon: <StatusIcon fontSize="small" />, label: t('ui.search.status'), prefix: '$' },
    { type: 'capacity' as const, icon: <CapacityIcon fontSize="small" />, label: t('ui.search.capacity'), prefix: '^' },
  ];

  // 検索実行時に履歴に追加
  const addToHistory = (query: string, filters: SearchFilter[]) => {
    if (!query.trim() && filters.length === 0) return;

    const historyItem: SearchHistory = {
      id: Date.now().toString(),
      query,
      filters: [...filters],
      timestamp: new Date(),
      isFavorite: false,
    };

    setSearchHistory(prev => {
      // 重複チェック
      const exists = prev.find(item => 
        item.query === query && 
        JSON.stringify(item.filters) === JSON.stringify(filters)
      );
      
      if (exists) return prev;

      // 履歴数制限
      const newHistory = [historyItem, ...prev].slice(0, maxHistoryItems);
      return newHistory;
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    
    // 記号で始まる場合はサジェストを表示
    const lastChar = value[value.length - 1];
    if (['@', '#', '%', '!', '$', '^'].includes(lastChar)) {
      setShowSuggestions(true);
      setAnchorEl(event.currentTarget);
    } else {
      setShowSuggestions(false);
    }

    onSearch?.(value, filters);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      addToHistory(searchQuery, filters);
    }
  };

  const handleSuggestionClick = (suggestion: typeof searchSuggestions[0]) => {
    const newFilter: SearchFilter = {
      type: suggestion.type,
      value: '',
      label: suggestion.label,
    };
    
    const newFilters = [...filters, newFilter];
    setFilters(newFilters);
    setSearchQuery('');
    setShowSuggestions(false);
    onFiltersChange?.(newFilters);
  };

  const handleFilterDelete = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleHistoryItemClick = (item: SearchHistory) => {
    setSearchQuery(item.query);
    setFilters(item.filters);
    onSearch?.(item.query, item.filters);
    onFiltersChange?.(item.filters);
    setHistoryMenuAnchor(null);
  };

  const handleToggleFavorite = (item: SearchHistory) => {
    if (item.isFavorite) {
      // お気に入りから削除
      setSearchHistory(prev => prev.map(h => 
        h.id === item.id ? { ...h, isFavorite: false, name: undefined } : h
      ));
    } else {
      // お気に入りに追加
      setSelectedHistoryItem(item);
      setFavoriteName(item.query || 'お気に入り検索');
      setFavoriteDialogOpen(true);
    }
  };

  const handleSaveFavorite = () => {
    if (selectedHistoryItem && favoriteName.trim()) {
      setSearchHistory(prev => prev.map(h => 
        h.id === selectedHistoryItem.id 
          ? { ...h, isFavorite: true, name: favoriteName.trim() }
          : h
      ));
      setFavoriteDialogOpen(false);
      setSelectedHistoryItem(null);
      setFavoriteName('');
    }
  };

  const handleDeleteHistory = (itemId: string) => {
    setSearchHistory(prev => prev.filter(h => h.id !== itemId));
  };

  const handleClickAway = () => {
    setShowSuggestions(false);
  };

  const favorites = searchHistory.filter(item => item.isFavorite);
  const recentHistory = searchHistory.filter(item => !item.isFavorite).slice(0, maxHistoryItems);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative' }}>
        {/* フィルタチップ */}
        {filters.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
            {filters.map((filter, index) => (
              <Chip
                key={index}
                label={filter.label}
                size="small"
                onDelete={() => handleFilterDelete(index)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        )}

        <SearchContainer>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder={t('ui.search.placeholder')}
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <IconButton
            size="small"
            onClick={(event) => setHistoryMenuAnchor(event.currentTarget)}
            sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
          >
            <HistoryIcon />
          </IconButton>
        </SearchContainer>

        {/* サジェスト */}
        <Popper
          open={showSuggestions}
          anchorEl={anchorEl}
          placement="bottom-start"
          transition
          style={{ zIndex: 1300 }}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper sx={{ mt: 1, minWidth: 200 }}>
                <List dense>
                  {searchSuggestions.map((suggestion) => (
                    <ListItem
                      key={suggestion.type}
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <ListItemIcon>{suggestion.icon}</ListItemIcon>
                      <ListItemText primary={suggestion.label} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grow>
          )}
        </Popper>

        {/* 検索履歴メニュー */}
        <Menu
          anchorEl={historyMenuAnchor}
          open={Boolean(historyMenuAnchor)}
          onClose={() => setHistoryMenuAnchor(null)}
          PaperProps={{
            sx: { minWidth: 300, maxHeight: 400 }
          }}
        >
          {/* お気に入り検索 */}
          {favorites.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                お気に入り検索
              </Typography>
              {favorites.map((item) => (
                <MenuItem 
                  key={item.id} 
                  onClick={() => handleHistoryItemClick(item)}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <ListItemIcon>
                    <PriorityIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name || item.query}
                    secondary={`${item.filters.length}個のフィルタ`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteHistory(item.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </MenuItem>
              ))}
              <Divider />
            </Box>
          )}

          {/* 検索履歴 */}
          {recentHistory.length > 0 ? (
            <Box>
              <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                検索履歴
              </Typography>
              {recentHistory.map((item) => (
                <MenuItem 
                  key={item.id} 
                  onClick={() => handleHistoryItemClick(item)}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.query || '（フィルタのみ）'}
                    secondary={`${item.timestamp.toLocaleDateString()} ${item.timestamp.toLocaleTimeString()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(item);
                      }}
                    >
                      <StarBorderIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteHistory(item.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </MenuItem>
              ))}
            </Box>
          ) : (
            <MenuItem disabled>
              <ListItemText primary="検索履歴がありません" />
            </MenuItem>
          )}

          {(favorites.length > 0 || recentHistory.length > 0) && (
            <>
              <Divider />
              <MenuItem 
                onClick={() => {
                  setSearchHistory([]);
                  setHistoryMenuAnchor(null);
                }}
              >
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText primary="履歴をすべて削除" />
              </MenuItem>
            </>
          )}
        </Menu>

        {/* お気に入り名前入力ダイアログ */}
        <Dialog 
          open={favoriteDialogOpen} 
          onClose={() => setFavoriteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>お気に入り検索に追加</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="名前"
              fullWidth
              variant="outlined"
              value={favoriteName}
              onChange={(e) => setFavoriteName(e.target.value)}
              helperText="この検索条件をお気に入りに保存する名前を入力してください"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFavoriteDialogOpen(false)}>
              キャンセル
            </Button>
            <Button 
              onClick={handleSaveFavorite}
              variant="contained"
              disabled={!favoriteName.trim()}
            >
              保存
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ClickAwayListener>
  );
};