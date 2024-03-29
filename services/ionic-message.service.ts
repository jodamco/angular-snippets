/** @format */

import { Injectable } from "@angular/core";
import {
  ActionSheetController,
  AlertController,
  IonicSafeString,
  LoadingController,
  ModalController,
  ToastController,
} from "@ionic/angular";

export const TOAST_TYPE = {
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "danger",
};

export const LOAD_TYPE = {
  CRESCENT: "crescent",
  LINES: "lines",
  HIDE: null,
};

@Injectable({
  providedIn: "root",
})
export class MessageService {
  private toastObjct: any;
  private alertObjct: any;
  private loadObjct: HTMLIonLoadingElement;
  private modalObjct: any;
  private actionSheetObjct: any;

  constructor(
    private toastCtrl: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController
  ) {}

  public async toast(
    text: string,
    type: string,
    duration?: number
  ): Promise<void> {
    let toast = await this.toastCtrl.create({
      message: text,
      cssClass: type,
      duration: duration != undefined ? duration : 3500,
      position: "bottom",
      color: type,
    });
    toast.present();
  }

  public async dismissableToast(
    text: string,
    type: string,
    xText?: string
  ): Promise<void> {
    this.toastObjct = await this.toastCtrl.create({
      message: text,
      cssClass: type,
      buttons: [
        {
          text: xText != undefined ? xText : "Ok",
          role: "cancel",
          handler: () => {},
        },
      ],
      position: "bottom",
    });
    this.toastObjct.present();
  }

  public dismissToast(): void {
    if (this.toastObjct != undefined) this.toastObjct.dismiss();
  }

  public async alert(
    title: string,
    message: string,
    okHandler: any,
    xHandler?: any,
    okText?: string,
    xText?: string
  ): Promise<void> {
    this.alertObjct = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: xText == undefined ? "voltar" : xText,
          role: "cancel",
          handler: () => {
            if (xHandler != undefined) xHandler();
          },
        },
        {
          text: okText == undefined ? "ok" : okText,
          handler: () => {
            let navTransition = this.alertObjct.dismiss();
            navTransition.then(() => {
              okHandler();
            });
            return false;
          },
        },
      ],
    });
    this.alertObjct.present();
  }

  public async singleOptionAlert(
    title: string,
    message: string,
    okHandler: any,
    okText?: string
  ): Promise<void> {
    this.alertObjct = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: okText == undefined ? "ok" : okText,
          handler: () => {
            let navTransition = this.alertObjct.dismiss();
            navTransition.then(() => {
              okHandler();
            });
            return false;
          },
        },
      ],
    });
    this.alertObjct.present();
  }

  public async loading(content: any, spinner: any): Promise<void> {
    let spinnerContent = new IonicSafeString(content);
    this.loadObjct = await this.loadingController.create({
      spinner: "dots",
      message: spinnerContent,
      duration: 10000,
    });
    this.loadObjct.present();
  }

  public async initalLoading(content: any, spinner: any): Promise<void> {
    let spinnerContent = new IonicSafeString(content);
    this.loadObjct = await this.loadingController.create({
      spinner: spinner,
      message: spinnerContent,
      duration: 10000,
      cssClass: "loading-custom",
    });
    this.loadObjct.present();
  }

  public updateLoading(content: string): void {
    let spinnerContent = new IonicSafeString(content);
    this.loadObjct.message = spinnerContent;
  }

  public syncText(progressValue: number): any {
    return `<p>Sincronizando</p> <p>${progressValue.toFixed(1)}%</p>
    <progress value="${progressValue}" max="100"></progress>`;
  }

  public dismissLoading(): void {
    this.loadObjct.dismiss();
  }

  public async modal(
    component: any,
    dismissHandler?: any,
    data?: any,
    cssClass?: string
  ): Promise<void> {
    this.modalObjct = await this.modalController.create({
      component: component,
      componentProps: data,
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: cssClass != undefined ? cssClass : "alert-like-modal",
    });
    this.modalObjct.onDidDismiss().then((modalResponse: any) => {
      if (dismissHandler != undefined) dismissHandler(modalResponse.data);
    });
    this.modalObjct.present();
  }

  public async dismissModal(modalData?: any): Promise<void> {
    if (modalData) await this.modalController.dismiss(modalData);
    else await this.modalController.dismiss();
  }

  public dismissAllModal() {
    let modals = document.querySelectorAll("ion-modal");
    modals.forEach((modal: any) => {
      modal.dismiss();
    });
  }

  public async actionSheet(title: string = "", buttons: any[]) {
    this.actionSheetObjct = await this.actionSheetController.create({
      header: title,
      animated: true,
      backdropDismiss: true,
      buttons: [
        ...buttons,
        {
          text: "Cancelar",
          icon: "close",
          role: "cancel",
          handler: () => {
            this.dismissActionSheet();
          },
        },
      ],
    });
    await this.actionSheetObjct.present();
  }

  public async dismissActionSheet(): Promise<void> {
    await this.actionSheetObjct.dismiss();
  }
}
