<script setup lang="ts">
import vueFilePond from 'vue-filepond'

import type { FilePondServerConfigProps } from 'filepond'

// Import plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

// Import styles
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import { deleteFileById, upload } from '~/api/file'
import type { ModelTypes } from '~/utils/graphql/zeus'
import { FileProviderEnum } from '~/utils/graphql/zeus'

const props = defineProps({
  bucket: {
    type: String,
    default: 'default',
  },
  provider: {
    type: String,
    default: FileProviderEnum.LOCAL,
  },
})

// Create FilePond component
const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview)

const options: FilePondServerConfigProps = {
  server: {
    url: '',
    process: async (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
      upload(file, props.bucket, props.provider as FileProviderEnum).then((res) => {
        load(JSON.stringify(res))
      }).catch((e) => {
        error('error')
      })
      return {
      }
    },
    revert: (uniqueFileId, load, error) => {
      try {
        const data = JSON.parse(uniqueFileId) as ModelTypes['File']
        if (data.id) {
          deleteFileById(data.id).then(() => {
            load()
          }).catch(() => {
            error('error')
          })
        }
      }
      catch (e) {
        error('error')
      }
    },
  },
}

function handleFilePondInit() {
  console.log('FilePond has initialized')
}
</script>

<template>
  <div>
    <FilePond
      label-idle="拖动文件、或者点击此处"
      accepted-file-types="image/jpeg, image/png"
      allow-multiple="true"
      max-files="3"
      :server="options.server"
      @init="handleFilePondInit"
    />
  </div>
</template>
