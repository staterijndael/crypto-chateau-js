
export let isMobile: boolean;
if (typeof window !== 'undefined') {
    isMobile = typeof window.screen.orientation !== 'undefined'
}else{
    isMobile = true
}
