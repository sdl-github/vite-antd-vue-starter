import type { BytemdPlugin } from 'bytemd'
import './index.css'

export default function codeBlock(): BytemdPlugin {
  return {
    viewerEffect({ markdownBody }) {
      const els = markdownBody.querySelectorAll('pre')
      if (els.length === 0) {
        return
      }
      const icon = '<svg viewBox="64 64 896 896" focusable="false" class="" data-icon="copy" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"></path></svg>'
      els.forEach((el) => {
        const codeDom = el.querySelector('code')
        const lang = Array.from(codeDom?.classList || [])?.find(name => name.includes('language'))?.split('language-')[1]
        const langDom = document.createElement('span')
        langDom.className = 'code-lang'
        lang && (langDom.innerHTML = lang)
        lang && el.appendChild(langDom)

        const copy = document.createElement('button')
        copy.className = 'copy-code-btn'
        copy.innerHTML = icon
        el.appendChild(copy)
        copy.addEventListener('click', () => {
          copy.innerHTML = 'ok'
          copy.style.background = '#1677ff'
          const code = codeDom?.textContent
          const copyEl = document.createElement('textarea')
          copyEl.value = code || ''
          document.body.appendChild(copyEl)
          copyEl.select()
          document.execCommand('copy')
          document.body.removeChild(copyEl)
          setTimeout(() => {
            copy.innerHTML = icon
            copy.style.background = 'hsla(0,0%,90.2%,.2)'
          }, 1000)
        })
      })
    },
  }
}
