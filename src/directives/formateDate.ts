import { App } from 'vue'
import dayjs from 'dayjs'

export default function registerFormateTimeDirective(app: App) {
    app.directive('time', {
        created(el, bindings) {

        },
        mounted(el, bindings) {
            const { isTimestamp  = false, format = "YYYY-MM-DD HH:mm:ss" } = bindings.value || {};
            const textContent = el.textContent;
            let timestamp;
            if(isTimestamp) {
                timestamp = parseInt(textContent);
                if (textContent.length === 10) {
                    timestamp = timestamp * 1000
                }
            }
            el.textContent = dayjs(isTimestamp ? timestamp : textContent).format(format);
        }
    })
}
