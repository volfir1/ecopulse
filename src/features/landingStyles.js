// styles.js
import { Palette } from "@shared/components/ui/colors";

export const landingPageStyles = {
  mainContainer: {
    bgcolor: Palette.background.default
  },

  // Navbar Styles
  navbar: {
    appBar: {
      bgcolor: "rgba(255, 255, 255, 0.95)",
      boxShadow: "none",
      borderBottom: "1px solid rgba(0,0,0,0.1)"
    },
    logo: {
      height: 50,
      width: "auto",
      objectFit: "contain"
    },
    title: {
      fontWeight: 500,
      color: Palette.primary.main
    },
    button: {
      color: "text.primary"
    },
    signUpButton: {
      bgcolor: Palette.primary.main,
      borderRadius: 6,
      px: 3,
      "&:hover": {
        bgcolor: Palette.hovers.primary
      }
    }
  },

  // Hero Section Styles
  hero: {
    container: {
      position: "relative",
      height: "100vh"
    },
    overlay: {
      position: "absolute",
      inset: 0,
      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        bgcolor: "rgba(0,0,0,0.3)",
        zIndex: 1
      }
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "all 0.5s ease-in-out"
    }
  },

  // Energy Types Section Styles
  energyTypes: {
    section: {
      py: 12,
      bgcolor: "white"
    },
    title: {
      variant: "h3",
      textAlign: "center",
      color: Palette.text.primary,
      fontWeight: 600
    },
    card: {
      height: "100%",
      borderRadius: 3,
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)"
      }
    },
    iconContainer: (color) => ({
      p: 2,
      borderRadius: "50%",
      bgcolor: `${color}20`,
      color: color
    }),
    typeTitle: {
      variant: "h5",
      fontWeight: 600,
      color: Palette.text.primary
    },
    description: {
      variant: "body1",
      textAlign: "center",
      color: Palette.text.secondary
    }
  },

  // Features Section Styles
  features: {
    section: {
      py: 12,
      bgcolor: Palette.background.subtle
    },
    title: {
      variant: "h3",
      textAlign: "center",
      color: Palette.primary.main,
      fontWeight: 600
    },
    card: {
      height: "100%",
      borderRadius: 3,
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)"
      }
    },
    iconContainer: {
      color: Palette.primary.main,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 64,
      height: 64,
      borderRadius: "50%",
      bgcolor: `${Palette.primary.main}15`
    }
  },

  // Team Section Styles
  team: {
    section: {
      py: 12,
      bgcolor: "white"
    },
    title: {
      variant: "h3",
      textAlign: "center",
      color: Palette.text.primary,
      fontWeight: 600
    },
    subtitle: {
      variant: "h6",
      textAlign: "center",
      color: Palette.text.secondary,
      maxWidth: "600px",
      lineHeight: 1.7
    },
    card: {
      height: "100%",
      borderRadius: 3,
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)"
      }
    },
    avatarContainer: {
      width: 120,
      height: 120,
      borderRadius: "50%",
      bgcolor: `${Palette.primary.main}15`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "2rem",
      color: Palette.primary.main,
      fontWeight: 600,
      mb: 2
    },
    memberName: {
      variant: "h5",
      fontWeight: 600,
      color: Palette.text.primary
    },
    memberRole: {
      variant: "body1",
      color: Palette.primary.main,
      fontWeight: 500
    },
    memberBio: {
      variant: "body2",
      textAlign: "center",
      color: Palette.text.secondary,
      lineHeight: 1.7
    },
    socialButton: {
      color: Palette.text.secondary,
      "&:hover": { 
        color: Palette.primary.main 
      }
    }
  }
};

// Common card styles that are reused across sections
export const commonStyles = {
  card: {
    height: "100%",
    borderRadius: 3,
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 8px 30px rgba(0,0,0,0.12)"
    }
  },
  sectionContainer: {
    py: 12
  },
  centerText: {
    textAlign: "center"
  }
};