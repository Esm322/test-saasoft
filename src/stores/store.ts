import { ref } from 'vue';
import { defineStore } from 'pinia';

import createId from '@/helpers/createId';

import type { ILogin, IValue, IMark } from '@/interfaces/logins';

export const useStore = defineStore('store', () => {
  const loginsJson: string | null = localStorage.getItem('logins');
  const loginsData = ref<ILogin[]>([]);
  loginsData.value = loginsJson !== null ? JSON.parse(loginsJson) : [];

  function saveLogins(): void {
    localStorage.setItem('logins', JSON.stringify(loginsData.value));
  }

  function addNewLogin(): void {
    loginsData.value.push({
      marks: [],
      mark: '',
      type: 'local',
      login: '',
      password: '',
      id: createId(loginsData.value),
    });

    saveLogins();
  }

  function changeLogin(
    id: number | undefined,
    type: IValue,
    login: IValue,
    password: IValue,
  ): void {
    loginsData.value.forEach((user: any) => {
      if (login.value && password.value) {
        if (user.id === id) {
          user.type = type.value;
          user.login = login.value;
          user.password = password.value;

          saveLogins();
        }
      }
    })
  }

  function changeMarks(
    id: number | undefined,
    marks: IMark[],
    mark: IValue,
  ): void {
    loginsData.value.forEach((user: any) => {
      if (user.login && user.password) {
        if (user.id === id) {
          user.marks = marks;
          user.mark = mark.value;

          saveLogins();
        }
      }
    })
  }

  function deleteLogin(id: number | undefined): void {
    loginsData.value.forEach((login: ILogin, i: number) => {
      if (login.id === id) {
        loginsData.value.splice(i, 1);

        saveLogins();
      }
    })
  }

  return {
    loginsData,
    saveLogins,
    addNewLogin,
    deleteLogin,
    changeLogin,
    changeMarks,
  }
})
