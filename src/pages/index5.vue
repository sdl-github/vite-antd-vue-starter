<script setup lang="tsx">
import { VxeTable } from 'vxe-table'
import type { VxeTableDefines, VxeTableEvents, VxeTableInstance } from 'vxe-table'
import { Menu, message } from 'ant-design-vue'
import { useTippy } from 'vue-tippy'
import { nnData } from './data'

const tableRef = ref<VxeTableInstance>({} as VxeTableInstance)
const tableData = ref()
const tableDataMap = ref()
const selectedRows = ref<Row[]>([])
interface Row {
  id: string
  parentWbsId?: string
  name: string
  code: string
  children: Row[]
  sort: string
  isWbs: boolean
}

onMounted(() => {
  initTable()
  setTimeout(() => {
    initDragEvent()
  }, 1000)
})
const HoverClass: any = {
  top: 'hover-top',
  center: 'hover-center',
  dash_center: 'hover-dash-center',
  forbidden_center: 'hover-forbidden-center',
  bottom: 'hover-bottom',
  topInner: 'hover-top-inner',
  bottomInner: 'hover-bottom-inner',
}

const DragPos = {
  top: 'top',
  forbidden_center: 'forbidden_center',
  center: 'center',
  bottom: 'bottom',
}
async function initTable() {
  tableData.value = nnData as unknown as Row[]
  const dataMap: any = {}
  nnData.forEach((item) => {
    dataMap[item.id] = item
  })
  tableDataMap.value = dataMap
}
const debouncedFnHandleTbodyDragOver = useThrottleFn((e: DragEvent | any) => {
  console.log('debouncedFnHandleTbodyDragOver')
  tbodyDragOver(e)
}, 100)

function tbodyDragOver(e: DragEvent | any) {
  console.log('handleTbodyDragOver')
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'

  const x = e.pageX
  // 保存初始化的pagex
  // @ts-expect-error
  const clientX = e.clientX
  // @ts-expect-error
  const offset = clientX - window.initClientX

  const y = e.clientY

  const el = tableRef.value?.$el.querySelector('.body--wrapper>.vxe-table--body tbody') as HTMLElement
  const rows = el.childNodes as unknown as HTMLElement[]
  // @ts-expect-error
  const dragNode = window.dragNode
  // @ts-expect-error
  const dragNodeId = window.dragNodeId
  const dragRect = dragNode.getBoundingClientRect()
  const dragW = dragRect.left + dragNode.clientWidth
  const dragH = dragRect.top + dragNode.clientHeight

  if (x >= dragRect.left && x <= dragW && y >= dragRect.top && y <= dragH) {
    // 相同位置 不操作
    return
  }
  let whereInsert = ''
  let targetId
  let hoverBlock
  let parentBlock
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const currentNodeId = row.getAttribute('rowid')
    if (!currentNodeId) {
      console.log('currentNodeId is empty!please set')
      return
    }
    const currentNodeData = tableRef.value.getRowById(currentNodeId!) as Row

    // if (currentNodeId !== dragNodeId) {
    //   return
    // }
    const rect = row.getBoundingClientRect()
    const rx = rect.left
    const ry = rect.top
    const rw = row.clientWidth
    const rh = row.clientHeight
    if (x > rx && x < (rx + rw) && y > ry && y < (ry + rh)) {
      targetId = currentNodeId
      hoverBlock = row
      const diffY = y - ry
      const rowHeight = row.offsetHeight
      if (diffY / rowHeight > 3 / 4) {
        whereInsert = DragPos.bottom
        if (!currentNodeData.children.length) {
          const currenParentId = currentNodeData.parentWbsId
          parentBlock = Array.from(rows).find((row) => {
            const id = row.getAttribute('rowid')
            return id === currenParentId
          })
        }
      }
      else if (diffY / rowHeight > 1 / 4) {
        whereInsert = DragPos.center
        if (!currentNodeData.isWbs) {
          console.log('current node is not wbs')
          whereInsert = DragPos.forbidden_center
        }
      }
      else {
        whereInsert = DragPos.top
        const currenParentId = currentNodeData.parentWbsId
        parentBlock = Array.from(rows).find((row) => {
          const id = row.getAttribute('rowid')
          return id === currenParentId
        })
      }
      break
    }
  }
  if (targetId === undefined) {
    whereInsert = ''
    return
  }
  clearHoverStyle()
  if (whereInsert === DragPos.top) {
    parentBlock && (parentBlock!.className = HoverClass.dash_center)
    hoverBlock!.className = HoverClass.top
  }
  if (whereInsert === DragPos.bottom) {
    parentBlock && (parentBlock!.className = HoverClass.dash_center)
    hoverBlock!.className = HoverClass.bottom
  }
  if (whereInsert === DragPos.center) {
    hoverBlock!.className = HoverClass.center
  }
  if (whereInsert === DragPos.forbidden_center) {
    hoverBlock!.className = HoverClass.forbidden_center
  }
  // console.log('targetId', targetId)
  // console.log('whereInsert', whereInsert)

  // @ts-expect-error
  window.dragTargetNodeId = targetId
  // @ts-expect-error
  window.dragTargetPos = whereInsert
}

function handleTbodyDragOver(e: DragEvent | any) {
  debouncedFnHandleTbodyDragOver(e)
}
function clearHoverStyle() {
  const el = tableRef.value?.$el.querySelector('.body--wrapper>.vxe-table--body tbody') as HTMLElement
  const rows = el.childNodes as unknown as HTMLElement[]
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]

    for (const key in HoverClass) {
      row.classList.remove(HoverClass[key])
    }
  }
}

function handleTbodyDragEnd(e: DragEvent | any) {
  clearHoverStyle()
  let { dragNodeId, dragTargetNodeId, dragTargetPos } = window
  console.log({ dragNodeId, dragTargetNodeId, dragTargetPos })
  if (dragTargetPos === DragPos.forbidden_center) {
    return
  }
  if (dragNodeId === dragTargetNodeId) {
    return
  }
  if (!dragNodeId || !dragTargetNodeId || !dragTargetPos) {
    return
  }
  const dragDom = document.querySelector(`#id_${dragNodeId}`)
  const lastDom = dragDom?.previousSibling as HTMLElement

  if (lastDom && lastDom.getAttribute('rowid') === dragTargetNodeId && dragTargetPos === DragPos.bottom) {
    console.log('bottom next is drag')
    return
  }
  const nextDom = dragDom?.nextSibling as HTMLElement
  if (nextDom && nextDom.getAttribute('rowid') === dragTargetNodeId && dragTargetPos === DragPos.top) {
    console.log('top pre is drag')
    return
  }
  let targetNodeData = tableRef.value.getRowById(dragTargetNodeId) as Row
  if ((dragTargetPos === DragPos.forbidden_center) && (!targetNodeData.isWbs)) {
    message.error('不是wbs节点')
    return
  }
  if (targetNodeData.parentWbsId === '0' && dragTargetPos === DragPos.top) {
    console.log('not move to root')
    return
  }
  // 移动到含有子节点的下面 视为移动到第一个子节点的上面
  if (targetNodeData.children && targetNodeData.children.length && dragTargetPos === DragPos.bottom) {
    dragTargetPos = DragPos.top
    const lastNode = targetNodeData.children[0]
    dragTargetNodeId = lastNode?.id
    targetNodeData = lastNode!
    console.log('cur=>', { dragNodeId, dragTargetNodeId, dragTargetPos })
  }

  let sort = ''
  let parentWbsId = null
  if (dragTargetPos === DragPos.center) {
    parentWbsId = dragTargetNodeId
    if (targetNodeData.children && targetNodeData.children.length) {
      const lastNode = targetNodeData.children.at(-1)
      sort = lastNode?.id || ''
    }
  }
  if (dragTargetPos === DragPos.top || dragTargetPos === DragPos.bottom) {
    parentWbsId = targetNodeData.parentWbsId
    if (dragTargetPos === DragPos.top) {
      const curDom = document.querySelector(`#id_${dragTargetNodeId}`)
      if (curDom) {
        const preDom = curDom.previousSibling as HTMLElement
        if (preDom && preDom.getAttribute('rowid') !== targetNodeData.parentWbsId) {
          sort = preDom.getAttribute('rowid') || ''
        }
        if (preDom && preDom.getAttribute('rowid') === targetNodeData.parentWbsId) {
          sort = targetNodeData.sort
        }
      }
    }
    if (dragTargetPos === DragPos.bottom) {
      sort = targetNodeData.id
    }
  }

  const data = {
    idList: [dragNodeId],
    parentWbsId,
    sortList: [sort],
  }
  if (Array.isArray(selectedRows.value) && selectedRows.value.length) {
    // 如果拖拽点 是 勾选中的其中一个 则视为拖拽勾选的 否则 就是仅拖拽点
    if (selectedRows.value.includes(dragTargetNodeId)) {
      const idList = getOutermostAndUnrelatedIds(selectedRows.value)

      const sortList = JSON.parse(JSON.stringify(idList))
      sortList.pop()
      sortList.unshift(sort)

      data.idList = idList
      data.sortList = sortList
    }
  }

  console.log(data)

  // console.log({ dragNodeId, dragTargetNodeId, dragTargetPos })
}

function initDragEvent() {
  const el = tableRef.value?.$el.querySelector('.body--wrapper>.vxe-table--body tbody') as HTMLElement

  el.addEventListener('dragover', handleTbodyDragOver, false)
  // el.addEventListener('dragend', handleTbodyDragEnd, false)

  initNodeItemsDragEvent(el.childNodes as unknown as HTMLElement[])
}

function handleNodeDragStart(e: DragEvent | any) {
  e.target.style.opacity = 0.2
  // 设置拖拽的数据类型为 "text/plain"
  const id = e.target.getAttribute('rowid')
  const targetNodeData = tableRef.value.getRowById(id) as Row

  e.dataTransfer.setData('text/plain', '')
  // 修改 ghost 的样式
  const ghost = document.createElement('div')
  ghost.innerText = targetNodeData.name
  ghost.style.width = '200px'
  ghost.style.height = '40px'
  ghost.style.display = 'flex'
  ghost.style.alignItems = 'center'
  ghost.style.background = '#EFFAF3'
  ghost.style.border = '2px solid #eee'
  ghost.style.padding = '0 5px'
  ghost.style.fontSize = '14px'
  ghost.className = 'drag-ghost'
  e.target.appendChild(ghost)

  e.dataTransfer.setDragImage(ghost, 0, 0)
  // @ts-expect-error
  window.dragNode = e.target
  // @ts-expect-error
  window.dragNodeId = id
  // @ts-expect-error
  window.initClientX = e.clientX
  const row = tableRef.value.getRowById(id) as Row
  if (row.children && row.children.length !== 0) {
    const isExpand = tableRef.value?.isTreeExpandByRow(row)
    if (!isExpand) {
      return
    }
    // 用于 tree-config，设置展开树形节点，二个参数设置这一行展开与否
    tableRef.value?.setTreeExpand(row, false)
  }
}

function handleNodeDragEnd(e: DragEvent | any) {
  console.log('handleNodeDragEnd==>')
  e.target.style.opacity = 1
  const ghost = document.querySelector('.drag-ghost')
  ghost?.remove()
  handleTbodyDragEnd(e)
}

function initNodeItemsDragEvent(els: HTMLElement[]) {
  console.log('initNodeItemsDragEvent==>', els)
  els.forEach((node) => {
    // node.classList.add('hover-bottom-inner')
    node.setAttribute('id', `id_${node.getAttribute('rowid')}` || '')
    node.setAttribute('draggable', 'true')
    node.addEventListener('dragstart', handleNodeDragStart, false)
    node.addEventListener('dragend', handleNodeDragEnd, false)
  })
}

function handleTreeExpand() {
  console.log('handleTreeExpand')
  setTimeout(() => {
    initDragEvent()
  }, 1000)
}

const debouncedFn = useDebounceFn(() => {
  console.log('handleScroll initDragEvent')
  initDragEvent()
}, 500)

function handleScroll() {
  debouncedFn()
}

const handleCheckChange: VxeTableEvents.CheckboxChange<Row> = (e) => {
  console.log(e)
  const records = tableRef.value.getCheckboxRecords()
  console.log(records)
  selectedRows.value = records
}

function getOutermostAndUnrelatedIds(nodes: Row[]) {
  const idMap: any = {}
  const result = []

  for (const node of nodes) {
    idMap[node.id] = node
  }

  for (const node of nodes) {
    const parent = idMap[node.parentWbsId!]
    if (!parent) {
      result.push(node.id)
    }
  }

  return result
}

// copy ==>
const ContextMenuComponent = {
  render: () =>
    h(Menu, [
      h(Menu.Item, { onClick: handleCopy, key: '0', style: { width: '100px' } }, '复制'),
      h(Menu.Item, { onClick: handlePaste, key: '1', style: { width: '100px' } }, '粘贴'),
    ]),
}

const curRightRowId = ref()
const finalCopyIds = ref<string[]>([])

function handleCopy() {
  // 单选copyRowId  多选 复选框
  finalCopyIds.value = [curRightRowId.value]
  // TODO 多个
}

function handlePaste() {

}

const { setProps, show } = useTippy(() => document.body, {
  appendTo: 'parent',
  content: ContextMenuComponent,
  trigger: 'manual',
  theme: 'white',
  interactive: true,
})

const handleCellMenu: VxeTableEvents.CellMenu = (e) => {
  curRightRowId.value = e.row.id
  e.$event.preventDefault()
  const x = (e.$event as any).clientX
  const y = (e.$event as any).clientY
  setProps({
    offset: [70, -80],
    getReferenceClientRect: () => ({
      width: 0,
      height: 0,
      top: y,
      bottom: y,
      left: x,
      right: x,
    }),
  })
  show()
  console.log({ x, y })
}

// keydown =====>
const ArrowKey = {
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
}
const isEditMode = ref(false)
function editModeKeyDown(e: VxeTableDefines.KeydownEventParams) {
  const EnterKey = 'Enter'
  const { $event, $table: $xetable } = e
  const key = ($event as KeyboardEvent).key
  if (EnterKey === key) {
    // TODO保存
    isEditMode.value = false
    tableRef.value.clearEdit()
    return
  }
  const ActiveKeyKeys = Object.keys(ArrowKey)
  if (ActiveKeyKeys.includes(key)) {
    isEditMode.value = false
    handleMove(e)
  }
}

function handleEdit(e: VxeTableDefines.KeydownEventParams) {
  const { $event, $table: $xetable } = e
  const selectCell = $xetable.getSelectedCell()
  const editRow = $xetable.getEditRecord()
  const cell = selectCell || editRow
  if (!cell) {
    console.log('please select or edit a cell')
    return
  }
  const { row, column } = cell

  tableRef.value.setEditCell(row, column)
  isEditMode.value = true
}

const keyDown: VxeTableEvents.Keydown = (e) => {
  if (isEditMode.value) {
    editModeKeyDown(e)
    return
  }
  const { $event, $table: $xetable } = e
  $event.preventDefault()
  const ActiveKeyKeys = Object.keys(ArrowKey)
  const key = ($event as KeyboardEvent).key
  const selectCell = $xetable.getSelectedCell()
  const editRow = $xetable.getEditRecord()
  const cell = selectCell || editRow
  if (!cell) {
    console.log('please select or edit a cell')
    return
  }
  if (ActiveKeyKeys.includes(key)) {
    handleMove(e)
    return
  }
  handleEdit(e)
}

function handleMove(e: VxeTableDefines.KeydownEventParams) {
  const { $event, $table: $xetable } = e
  const selectCell = $xetable.getSelectedCell()
  const editRow = $xetable.getEditRecord()
  const cell = selectCell || editRow
  if (!cell) {
    console.log('please select or edit a cell')
    return
  }
  const params = Object.assign({}, cell)
  const key = ($event as KeyboardEvent).key
  const { internalData } = $xetable
  const { afterFullData, visibleColumn, scrollYStore } = internalData
  const _rowIndex = $xetable.getVMRowIndex(params.row) + scrollYStore.startIndex
  const _columnIndex = $xetable.getVTColumnIndex(params.column)
  if (ArrowKey.ArrowUp === key && _rowIndex > 0) {
    // 移动到上一行
    params.rowIndex = _rowIndex - 1
    params.row = afterFullData[params.rowIndex]
  }
  else if (ArrowKey.ArrowDown === key && _rowIndex < afterFullData.length - 1) {
    // 移动到下一行
    params.rowIndex = _rowIndex + 1
    params.row = afterFullData[params.rowIndex]
  }
  else if (ArrowKey.ArrowLeft === key && _columnIndex) {
    // 移动到左侧单元格
    params.columnIndex = _columnIndex - 1
    params.column = visibleColumn[params.columnIndex]
  }
  else if (ArrowKey.ArrowRight === key && _columnIndex < visibleColumn.length - 1) {
    // 移动到右侧单元格
    params.columnIndex = _columnIndex + 1
    params.column = visibleColumn[params.columnIndex]
  }
  console.log(params)

  $xetable.scrollToRow(params.row, params.column).then(() => {
    params.cell = $xetable.getCell(params.row, params.column)
    $xetable.handleSelected(params, $event)
  })
}
// keydown ====>

function handleDelSelect() {
  console.log(selectedRows.value)
  const id = selectedRows.value[0].id
  const leftData = nnData.filter(item => item.id !== id)
  console.log(leftData)
  tableData.value = leftData
  tableRef.value.clearCheckboxRow()
}
</script>

<template>
  <div class="con">
    <a-button @click="handleDelSelect">
      删除
    </a-button>
    <VxeTable
      ref="tableRef" border row-id="id" :edit-config="{ trigger: 'dblclick', mode: 'cell', showIcon: false }"
      show-overflow height="800" :row-config="{ isHover: true }" :scroll-y="{ gt: 20 }"
      :sort-config="{ defaultSort: { field: 'sort', order: 'desc' } }"
      :mouse-config="{ selected: true }"
      :tree-config="{ transform: true, rowField: 'id', expandAll: true, parentField: 'parentWbsId' }" :data="tableData"
      :menu-config="{ trigger: 'default' }"
      @toggle-tree-expand="handleTreeExpand"
      @scroll="handleScroll"
      @checkbox-change="handleCheckChange"
      @cell-menu="handleCellMenu"
      @keydown="keyDown"
    >
      >
      <vxe-column type="checkbox" width="50" align="center" />
      <vxe-column field="isWbs" width="200" align="center">
        <template #default="{ row }">
          <div :style="row.isWbs ? 'color:green' : 'color:red' ">
            {{ row.isWbs }}
            {{ row.isWbs ? '能移' : '不能' }}
          </div>
        </template>
      </vxe-column>
      <vxe-column field="id" width="200" title="id" align="center" />
      <vxe-column field="parentWbsId" width="200" title="parentWbsId" align="center" />
      <vxe-column tree-node field="name" title="工程部位" :edit-render="{ autofocus: '.ant-input' }">
        <template #default="{ row }">
          <div class="flex items-center">
            <div class="ml-2 select-none">
              {{ row.name }}
            </div>
          </div>
        </template>
        <template #edit="scope">
          <a-input v-model:value="scope.row.name" type="text" />
        </template>
      </vxe-column>
      <vxe-column field="sort" title="sort" />
    </VxeTable>
  </div>
</template>

<style lang="scss">
.tippy-box[data-theme~='white'] {
      background-color: white !important;
      border-radius: 4px !important;
      border-width: 1px !important;
      box-shadow: 0 12px 20px rgba(0, 0, 0, .16);
  .tippy-content {
      padding: 0 !important;
  }
}
.con {
  :deep(.row-selected) {
    background: #EFFAF3;
    user-select: none;
  }

  [draggable] {
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    /* Required to make elements draggable in old WebKit */
    -khtml-user-drag: element;
    -webkit-user-drag: element;
  }

  .hover-top td {
    border-top: 2px solid rgb(20, 86, 240);
  }

  .hover-top-inner td:not(:nth-child(1)) {
    border-top: 2px solid rgb(20, 86, 240);
  }

  .hover-bottom td {
    border-bottom: 2px solid rgb(20, 86, 240);
  }

  .hover-bottom-inner td:not(:nth-child(1)) {
    border-bottom: 2px solid rgb(20, 86, 240);
  }

  .hover-center td:not(:nth-child(1)) {
    border-top: 2px solid rgb(20, 86, 240);
    border-bottom: 2px solid rgb(20, 86, 240);
    height: 25%;
    background: #a0c8f7;
  }
  .hover-dash-center td:not(:nth-child(1)) {
    border-top: 2px dashed rgb(20, 86, 240);
    border-bottom: 2px dashed rgb(20, 86, 240);
    height: 25%;
    // background: #a0c8f7;
  }

  .hover-dash-center td:nth-child(2) {
    border-left: 2px dashed rgb(20, 86, 240);
  }

  .hover-dash-center td:last-child {
    border-right: 2px dashed rgb(20, 86, 240);
  }
  .hover-forbidden-center td{
    opacity: 0.2;
    color: red;
    cursor: not-allowed;
  }

  .hover-center td:nth-child(2) {
    border-left: 2px solid rgb(20, 86, 240);
  }

  .hover-center td:last-child {
    border-right: 2px solid rgb(20, 86, 240);
  }
}
</style>
