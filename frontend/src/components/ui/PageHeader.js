import React from 'react';
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link, 
  Button, 
  Chip,
  useTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

/**
 * A reusable page header component with breadcrumbs, title, and actions
 * 
 * @param {Object} props
 * @param {string} props.title - The page title
 * @param {string} props.subtitle - Optional subtitle
 * @param {Array} props.breadcrumbs - Array of breadcrumb objects with {label, path}
 * @param {React.ReactNode} props.startAction - Primary action button/component to display
 * @param {React.ReactNode} props.endAction - Secondary action button/component to display
 * @param {string} props.tag - Optional tag/label
 * @param {string} props.tagColor - Color for the tag
 * @param {React.ReactNode} props.icon - Optional icon
 * @param {Object} props.sx - Optional style overrides
 */
const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  startAction,
  endAction,
  tag,
  tagColor = 'primary',
  icon,
  sx = {},
  ...rest
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 4, ...sx }} {...rest}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          {breadcrumbs.map((breadcrumb, index) => (
            <Link
              key={index}
              component={breadcrumb.path ? RouterLink : 'span'}
              to={breadcrumb.path}
              color="inherit"
              underline={breadcrumb.path ? 'hover' : 'none'}
              sx={{ 
                fontSize: '0.85rem',
                color: index === breadcrumbs.length - 1 ? 'text.primary' : 'text.secondary',
                fontWeight: index === breadcrumbs.length - 1 ? 600 : 400,
              }}
            >
              {breadcrumb.label}
            </Link>
          ))}
        </Breadcrumbs>
      )}

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon && (
            <Box 
              sx={{ 
                mr: 2,
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </Box>
          )}
          
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  mr: tag ? 2 : 0
                }}
              >
                {title}
              </Typography>
              
              {tag && (
                <Chip 
                  label={tag} 
                  color={tagColor} 
                  size="small" 
                  sx={{ fontWeight: 500 }} 
                />
              )}
            </Box>
            
            {subtitle && (
              <Typography 
                variant="body1" 
                color="text.secondary"
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {startAction && (
            <Box>
              {startAction}
            </Box>
          )}
          
          {endAction && (
            <Box>
              {endAction}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PageHeader;
