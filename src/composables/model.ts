import { Ref, ref, watchEffect } from 'vue'
import { useUserPerfsStore } from 'src/stores/user-perfs'
import { Model, Provider } from 'src/utils/types'
import { useObservable } from '@vueuse/rxjs'
import { db } from 'src/utils/db'
import { LitellmBaseURL } from 'src/utils/config'
import { ProviderTypes } from 'src/utils/values'

export function useModel(provider: Ref<Provider>, model: Ref<Model>) {
  const sdkModel = ref(null)
  const _model = ref<Model>(null)
  const { perfs } = useUserPerfsStore()
  const user = useObservable(db.cloud.currentUser)
  watchEffect(() => {
    _model.value = model.value || perfs.model
    if (!_model.value) {
      sdkModel.value = null
      _model.value = null
      return
    }
    let _provider: Provider = null
    if (provider.value) _provider = provider.value
    else if (perfs.provider) _provider = perfs.provider
    else if (user.value.isLoggedIn) {
      _provider = { type: 'openai', settings: { apiKey: user.value.data.apiKey, baseURL: LitellmBaseURL, compatibility: 'strict' } }
    } else {
      sdkModel.value = null
      _model.value = null
      return
    }
    sdkModel.value = ProviderTypes.find(p => p.name === _provider.type).constructor(_provider.settings)(_model.value.name)
  })
  return { sdkModel, model: _model }
}
