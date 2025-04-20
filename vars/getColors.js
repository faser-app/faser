import theme from './theme'
import colors from '~/vars/colors'

const currentPalette = ref()

if (theme.value === 'purple') {
    currentPalette.value = colors.value.purple
}

if (theme.value === 'orangeblue') {
    currentPalette.value = colors.value.orangeblue
}

if (theme.value === 'green') {
    currentPalette.value = colors.value.green
}

if (theme.value === 'bluepurple') {
    currentPalette.value = colors.value.bluepurple
}

if (theme.value === 'purpleblue') {
    currentPalette.value = colors.value.purpleblue
}

if (theme.value === 'normal') {
    currentPalette.value = colors.value.normal
}

if (theme.value === 'cyan') {
    currentPalette.value = colors.value.cyan
}

if (theme.value === 'carmine') {
    currentPalette.value = colors.value.carmine
}

export default currentPalette
