<template>
  <li class="item">
    <label class="label">
      <input class="input" maxlength="50" name="marks" type="text" v-model="setMark">
    </label>
    <label class="label">
      <select class="select" name="type" @change="localType" v-model="setType" :checked="props.type">
        <option value="local">
          Локальная
        </option>
        <option value="LDAP">
          LDAP
        </option>
      </select>
    </label>
    <label class="label" :class="{ 'passwordNull': props.type === 'LDAP' }">
      <input required maxlength="100" class="input" name="login" type="text" v-model="setLogin"
        :class="{ 'unvalid': !setLogin }">
    </label>
    <label class="label label-password" v-show="props.type === 'local'">
      <input required maxlength="100" class="input" name="password" :type="props.switch" v-model="setPassword"
        :class="{ 'unvalid': !setPassword }">
      <span class="hidden" @click="showPassword">*</span>
    </label>
    <button class="delete btn-reset" @click.prevent="store.deleteLogin(props.id)">&times;</button>
  </li>
  <button>clock</button>
</template>


<script setup lang="ts">
import { computed, watch, ref } from 'vue';

import { useStore } from '@/stores/store';

import debounce from 'lodash.debounce';

import type { IMark } from '@/interfaces/logins';

const store = useStore();

const props = defineProps<{
  marks: IMark[],
  mark: string,
  type: string,
  login: string,
  password: string,
  switch: string,
  id: number | undefined,
}>();

const emits = defineEmits<{
  (event: 'update:mark', value: string): void,
  (event: 'update:type', value: string): void,
  (event: 'update:login', value: string): void,
  (event: 'update:password', value: string): void,
  (event: 'update:switch', value: string): void,
}>();

const currMarks = ref<IMark[]>([]);

const setMark = computed({
  get: (): string => props.mark,
  set: (val: string): void => emits('update:mark', val),
});
const setType = computed({
  get: (): string => props.type,
  set: (val: string): void => emits('update:type', val),
});
const setLogin = computed({
  get: (): string => props.login,
  set: (val: string): void => emits('update:login', val),
});
const setPassword = computed({
  get: (): string => props.password,
  set: (val: string) => {
    if (setType.value === 'local') {
      emits('update:password', val)
    }
  },
});
const showPassword = (): void => {
  if (props.password !== 'null') {
    if (props.switch === 'password') {
      emits('update:switch', '');
    } else {
      emits('update:switch', 'password');
    }
  }
};
const localType = (): void => {
  if (props.type === 'LDAP') {
    emits('update:password', 'null');
  } else {
    emits('update:password', '');
  }
};

watch([setMark, setType, setLogin, setPassword], debounce(([newMark, newType, newLogin, newPassword]) => {
  if (newType || newLogin || newPassword) {
    store.changeLogin(props.id, setType, setLogin, setPassword);
  }

  if (newMark) {
    currMarks.value = newMark.split(';').filter((item: string) => item !== '');

    store.changeMarks(props.id, currMarks.value, setMark)
  } else if (newMark === '') {
    currMarks.value = [];
    store.changeMarks(props.id, currMarks.value, setMark)
  }
}, 3000));
</script>
