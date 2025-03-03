import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Chip, 
  LinearProgress, 
  Tooltip,
  useTheme
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

/**
 * A reusable data card component for displaying statistics and information
 * 
 * @param {Object} props 
 * @param {string} props.title - The card title
 * @param {string|number} props.value - The main value to display
 * @param {string} props.subtitle - Optional subtitle or description
 * @param {ReactNode} props.icon - Optional icon to display
 * @param {string} props.iconColor - Color for the icon background
 * @param {'up'|'down'|null} props.trend - Optional trend direction
 * @param {string|number} props.trendValue - Optional trend value (e.g. "+12%")
 * @param {number} props.progress - Optional progress value (0-100)
 * @param {Object} props.actions - Optional actions menu items
 * @param {string} props.chipLabel - Optional chip label 
 * @param {string} props.chipColor - Optional chip color
 * @param {Object} props.sx - Optional style overrides
 */
const DataCard = ({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  trend,
  trendValue,
  progress,
  actions,
  chipLabel,
  chipColor = 'primary',
  sx = {},
  ...rest
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleActionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Determine trend color
  const getTrendColor = () => {
    if (trend === 'up') return theme.palette.success.main;
    if (trend === 'down') return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        ...sx 
      }} 
      {...rest}
    >
      {progress !== undefined && (
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            height: 4, 
            borderTopLeftRadius: 12, 
            borderTopRightRadius: 12,
          }} 
        />
      )}
      
      <CardContent sx={{ flexGrow: 1, pt: progress !== undefined ? 3 : undefined }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            {chipLabel && (
              <Chip 
                label={chipLabel} 
                color={chipColor} 
                size="small" 
                sx={{ mb: 1, fontWeight: 500 }} 
              />
            )}
            
            <Typography 
              variant="subtitle1" 
              color="text.secondary" 
              gutterBottom
              sx={{ 
                fontSize: '0.875rem',
                mb: 0.5,
                display: 'block' 
              }}
            >
              {title}
            </Typography>
          </Box>
          
          {actions && (
            <IconButton 
              size="small" 
              onClick={handleActionsClick}
              sx={{ mt: -0.5 }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          )}
          
          {icon && (
            <Box 
              sx={{ 
                bgcolor: iconColor || theme.palette.primary.main, 
                color: 'white',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ fontWeight: 700 }}
          >
            {value}
          </Typography>
          
          {trend && trendValue && (
            <Tooltip title={trend === 'up' ? 'Wzrost' : 'Spadek'}>
              <Typography 
                variant="body2"
                component="span"
                sx={{ 
                  ml: 1.5, 
                  color: getTrendColor(),
                  fontWeight: 500
                }}
              >
                {trendValue}
              </Typography>
            </Tooltip>
          )}
        </Box>
        
        {subtitle && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: 1 }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default DataCard;
