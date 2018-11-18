import * as firebase from 'firebase'
//if export default,  import saveReportDetails
//if export const, import {saveReportDetails}

const saveReportDetails = (type,objectID,details) => {
	console.log("upload details")
  return new Promise ((resolve, reject)=>{

    firebase.database().ref(type+"/"+objectID+"/").update({
		description: details.description,
        publicSetting : details.publicSetting,
        userid : details.userid,
		authorityid: details.authorityid,
		description : details.description
      }
    ).then(()=> {
      console.log("INSERTED")
      resolve(true)
    }).catch((error)=>{
	  console.log("ERROR AT saveReportDetails")
      reject(error)
    })

    })

}

//reference: https://firebase.google.com/docs/database/web/read-and-write Update specific fields Part
const uploadReport = (type,newReportKey,details) => {
	console.log("upload report")
    return new Promise ((resolve, reject)=>{


	var updates = {};
	//upload full details to Reports/
	updates['/Reports/' + newReportKey] = details;
	//upload reportKey to username/ReportsMade
	console.log("title",details.title);
	updates['/users/' + details.userid + '/ReportsMade/'+newReportKey] = details.title;
	//upload reportKey to authorityName/ReportsReceived
	updates['/users/' + details.authorityid + '/ReportsReceived/'+newReportKey] = details.title;
	firebase.database().ref().update(updates
    ).then(()=> {
      console.log("INSERTED")
      resolve(true)
    }).catch((error)=>{
	  console.log("ERROR AT saveReportDetails")
      reject(error)
    })

    })
}

//this is for editing details
const editReportDetails = (type,objectID,param,paramDetail) => {
	console.log("upload details")
  return new Promise ((resolve, reject)=>{

    firebase.database().ref(type+"/"+objectID+"/").update({
		//description: details.description,
        //publicSetting : details.publicSetting,
        //userid : details.userid,
		//authorityid: details.authorityid,
		[param] : paramDetail
      }
    ).then(()=> {
      console.log("INSERTED")
      resolve(true)
    }).catch((error)=>{
	  console.log("ERROR AT saveReportDetails")
      reject(error)
    })

    })

}

const appendReportDetails = (type,objectID,param,paramDetail) => {
	console.log("upload details")
  return new Promise ((resolve, reject)=>{

    //firebase.database().ref(type+"/"+objectID+"/").push().setValue("try1234567"
    firebase.database().ref("try").child("try1234567").push().update({
		reportsMade: true
	}).then(()=> {
      console.log("INSERTED")
      resolve(true)
    }).catch((error)=>{
	  console.log("ERROR AT saveReportDetails")
      reject(error)
    })

    })

}

//this is for editing details
const addResponse = (type,objectID,param,paramDetail) => {
	console.log("upload details")
  return new Promise ((resolve, reject)=>{

    firebase.database().ref(type+"/"+objectID+"/").update({
		response : details.response
      }
    ).then(()=> {
      console.log("INSERTED")
      resolve(true)
    }).catch((error)=>{
	  console.log("ERROR AT saveReportDetails")
      reject(error)
    })

    })

}

export {saveReportDetails,editReportDetails,addResponse,appendReportDetails,uploadReport};
