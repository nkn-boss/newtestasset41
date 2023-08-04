import {track,api, LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import candidateDetailsUpload from '@salesforce/apex/GitRESTCallouts.candidateDetailsUpload';
import uploadFile from '@salesforce/apex/GitRESTCallouts.uploadFile';
export default class FetchProjectDetails extends LightningElement {
    @track projectName;
    @track userName;
    @track email;
    @track clientId;
    @track privateKey;
    error;
    @api recordId;
    @track fileData
    openfileUpload(event) {
        const file = event.target.files[0]
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
                'filename': file.name,
                'base64': base64,
                'recordId': this.recordId
            }
            console.log(this.fileData)
        }
        reader.readAsDataURL(file)
    }
    
    handleClick(){
      //  const {base64, filename, recordId} = this.fileData
        uploadFile({ base64:this.fileData.base64, filename:this.fileData.filename})
        .then(result => {
            console.log('Data :'+ result);
            this.privateKey= result;
            let titleText = ` ${this.fileData.filename} uploaded successfully!!`;
            this.fileData=null;
            this.toast(titleText);
        }) .catch(error => {
            console.log(error);
            this.error = error;
        }); 
           // this.fileData=null;
    }
    fetchProjectName(event){
        this.projectName = event.target.value;
    }
    fetchEmail(event){
        this.email = event.target.value;
    }
    fetchUserName(event){
        this.userName = event.target.value;
    }
    fetchClientId(event){
        this.clientId = event.target.value;
    }
    get handleDisable(){
        return !(this.projectName && this.privateKey && this.email && this.clientId  && this.userName);   
    }
    move(e){
     var wrapperData={
        projectName: this.projectName,
        orgEmail:this.email,
        orgUsername:this.userName,
        privateKeyFileId:this.privateKey,
        orgclientId:this.clientId,  
     };
     candidateDetailsUpload({cd:JSON.stringify(wrapperData)})   
        .then(result => {
            console.log('Data :'+ JSON.stringify(wrapperData));
        }) .catch(error => {
            console.log(error);
            this.error = error;
        }); 
    }
    toast(titleText){
        const evt = new ShowToastEvent({
            title:`${titleText}`, 
            message:'Upload Success',
            variant:'success',
        });
        this.dispatchEvent(evt);
    }
    
    
}