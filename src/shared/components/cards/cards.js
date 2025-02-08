import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { elements, Palette } from '../ui/colors';

// Styled components for different card variants
const StyledCard = styled(MuiCard)(({ theme, variant = 'default', elevation = 1 }) => {
  const variants = {
    default: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius * 2,
    },
    solar: {
      backgroundColor: theme.palette.background.paper,
      borderLeft: `4px solid ${elements.solar}`,
      borderRadius: theme.shape.borderRadius * 2,
    },
    wind: {
      backgroundColor: theme.palette.background.paper,
      borderLeft: `4px solid ${elements.wind}`,
      borderRadius: theme.shape.borderRadius * 2,
    },
    success: {
      backgroundColor: theme.palette.background.paper,
      borderLeft: `4px solid ${Palette.success.main}`,
      borderRadius: theme.shape.borderRadius * 2,
    },
    warning: {
      backgroundColor: theme.palette.background.paper,
      borderLeft: `4px solid ${Palette.warning.main}`,
      borderRadius: theme.shape.borderRadius * 2,
    },
    error: {
      backgroundColor: theme.palette.background.paper,
      borderLeft: `4px solid ${Palette.error.main}`,
      borderRadius: theme.shape.borderRadius * 2,
    },
    outlined: {
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius * 2,
    },
    gradient: {
      background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
      borderRadius: theme.shape.borderRadius * 2,
    }
  };

  return {
    ...variants[variant],
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[elevation + 1],
    }
  };
});

// Styled CardHeader with consistent spacing
const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  padding: theme.spacing(3),
  '& .MuiCardHeader-title': {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  '& .MuiCardHeader-subheader': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  }
}));

// Styled CardContent with consistent spacing
const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  '&:last-child': {
    paddingBottom: theme.spacing(3),
  }
}));

// Styled CardActions with consistent spacing
const StyledCardActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  justifyContent: 'flex-end',
}));

// Statistic display component for cards
const StatisticDisplay = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

// Main Card component with all variants
const Card = ({
  variant = 'default',
  elevation = 1,
  title,
  subheader,
  action,
  children,
  className,
  stats,
  footer,
  ...props
}) => {
  return (
    <StyledCard variant={variant} elevation={elevation} className={className} {...props}>
      {(title || subheader || action) && (
        <StyledCardHeader
          title={title}
          subheader={subheader}
          action={action}
        />
      )}
      
      <StyledCardContent>
        {stats && (
          <StatisticDisplay>
            <Typography variant="h3" color="primary" fontWeight="bold">
              {stats.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stats.label}
            </Typography>
          </StatisticDisplay>
        )}
        {children}
      </StyledCardContent>

      {footer && (
        <StyledCardActions>
          {footer}
        </StyledCardActions>
      )}
    </StyledCard>
  );
};

// Preset card variants for specific use cases
export const MetricCard = ({ title, value, label, trend, ...props }) => (
  <Card
    {...props}
    stats={{
      value: value,
      label: label
    }}
    title={title}
  />
);

export const ChartCard = ({ title, subheader, chart, ...props }) => (
  <Card
    {...props}
    title={title}
    subheader={subheader}
  >
    <Box sx={{ height: 300, width: '100%' }}>
      {chart}
    </Box>
  </Card>
);

export const DashboardCard = ({ title, subheader, children, ...props }) => (
  <Card
    {...props}
    variant="gradient"
    elevation={2}
    title={title}
    subheader={subheader}
  >
    {children}
  </Card>
);

// Example usage of custom variants
export const SolarCard = (props) => (
  <Card variant="solar" {...props} />
);

export const WindCard = (props) => (
  <Card variant="wind" {...props} />
);

export const SuccessCard = (props) => (
  <Card variant="success" {...props} />
);

export const WarningCard = (props) => (
  <Card variant="warning" {...props} />
);

export const ErrorCard = (props) => (
  <Card variant="error" {...props} />
);

export default Card;