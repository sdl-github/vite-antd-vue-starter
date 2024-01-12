import type { Rule } from 'ant-design-vue/es/form'

/**
 * @param {string} path
 * @returns {boolean}
 */
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 用户名校验
 * @param rule
 * @param value
 * @param callback
 */
export function validateUsername(rule: Rule, value: string | number) {
  if (!/^[a-zA-Z0-9_-]{4,8}$/.test(value.toString()))
    return Promise.reject(new Error('请输入4到8位字母或数字'))
  else
    return Promise.resolve()
}

/**
 * 姓名校验
   1.可以是中文
   2.可以是英文，允许输入点（英文名字中的那种点）， 允许输入空格
   3.中文和英文不能同时出现
   4.长度在20个字符以内
 * @param rule
 * @param value
 * @param callback
 */
export function validateRealName(rule: Rule, value: string) {
  if (!/^([\u4E00-\u9FA5]{2,20}|[a-zA-Z.\s]{2,20})$/.test(value))
    return Promise.reject(new Error('请输入正确格式的姓名'))
  else
    return Promise.resolve()
}

/**
 * 验证手机号
 * @param rule
 * @param value
 * @param callback
 */
export function validatePhone(rule: Rule, value: string) {
  if (!/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(value))
    return Promise.reject(new Error('请输入正确的手机号'))
  else
    return Promise.resolve()
}

/**
 * 验证邮箱
 * @param rule
 * @param value
 * @param callback
 */
export function validateEmail(rule: Rule, value: string) {
  if (!/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value))
    return Promise.reject(new Error('请输入正确的邮箱'))
  else
    return Promise.resolve()
}
