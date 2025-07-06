// We're not supposed to override default sm, xs ..
//  tailwind.config.js file is deprecated and we always should change variables in base.less
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  theme: {
    fontSize: {
      ...defaultTheme.fontSize,
      sm: '0.855rem',
      xs: '0.72rem',
      xxs: '0.57rem',
    },
  },
}
