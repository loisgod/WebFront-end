import { Request } from './axios-service';
let direction={};

export  function transformDirectionData(value,code) {
    if(!direction[code]) {
        direction[code]=JSON.parse(window.sessionStorage.getItem(code));
    }
    if(value==undefined || value==null || direction[code]["_"+String(value)]==null) {
        return direction[code]['default'];
    } else {
        return direction[code]["_"+String(value)];
    }
}

export function hasDirectionKey(code) {
    return window.sessionStorage.getItem(code)!=null;
}

export async function getDirection() {
    const response = await Request('GET','/ajax/dictionary');
    const {data}=response.data;
    // console.log('dictation',response);
    const res = await addDirection(data);
    window.sessionStorage.setItem('dictation',JSON.stringify(res));
}
export function getDictationbyCode(code) {
    const dictation=JSON.parse(window.sessionStorage.getItem('dictation'));
    if(dictation!=null ) {
        return dictation[code];
    }
    return null;
}
export async function getRole(){
    return new Promise((resolve,reject)=>{
        Request('GET','/ajax/roleright/roleList').then(async (response)=>{
        let {data} = response.data;
        let res=[];
        let dir={};
        for(let i=0;i<data.length;++i) {
          res.push({'roleDes':data[i].roleDes,'roleId':data[i].roleId});
          dir["_"+data[i].roleId]=data[i].roleDes;
        }
        window.sessionStorage.setItem('role',JSON.stringify(res));
        window.sessionStorage.setItem('roleTrans',JSON.stringify(dir));
        resolve();
      });
    });
}
// export function getRoleRight(){
//     Request('GET','/ajax/roleright/rightList').then((response)=>{
//         const {data} = response.data;
//         let res={};
//         for(let i=0;i<data.length;++i) {
//             res[data[i].rightName]=data[i].rightId;
//         }
//         console.log('rightList',res);
//         window.sessionStorage['roleright']=JSON.stringify(res);
//     })
// }
// export async function getRoleRightbyId(Id){
//     if(Id==0) return [];
//         const a1=new Promise((resolve,reject)=>{
//             Request('GET','/ajax/roleright/getRoleById/'+Id).then(async (response)=>{
//                 const data = response.data.data.rolerights;
//                 console.log('my role',data);
//                 let res=[];
//                 for(let i=0;i<data.length;++i) {
//                     res.push(data[i].rightId);
//                 }
//                 resolve(res);
//             });
//         })
//         const a2=new Promise((resolve,reject)=>{
//             Request('GET','/ajax/roleright/roleList').then(async (response)=>{
//             let {data} = response.data;
//             let res=[];
//             let dir={};
//             for(let i=0;i<data.length;++i) {
//               res.push({'roleDes':data[i].roleDes,'roleId':data[i].roleId});
//               dir["_"+data[i].roleId]=data[i].roleDes;
//             }
//             window.sessionStorage.setItem('role',JSON.stringify(res));
//             window.sessionStorage.setItem('roleTrans',JSON.stringify(dir));

//             resolve();
//           });
//         });
//         return new Promise((resolve,reject)=>{
//             Promise.all([a1,a2]).then((e)=>{
//                 resolve(e[0]);
//             })
//         });
    
// }
function  addDirection(list) {
    if(list.length==0) return [];
    let dictation={}; 
    let request=[];
    for(let i = 0;i<list.length;++i) {
        request[i]=new Promise((resolve,reject)=>{
            Request('GET','/ajax/dictionary/dictionarydetailbycode/'+list[i].dictionaryCode).then(async (response)=>{
                const {data}=response.data;
                let dire={};
                dictation[list[i].dictionaryCode]=data;
                for(let j=0;j<data.length;++j) {
                    dire["_"+String(data[j].itemKey)]=data[j].itemValue;
                    if(data[j].isdefault==1) dire['default']=data[j].itemValue;
                }
                window.sessionStorage.setItem(list[i].dictionaryCode,JSON.stringify(dire));
                if(list[i].child) {
                    const child = await addDirection(list[i].child);
                    dictation=Object.assign(dictation,child);
                }
                resolve();
              });
        });
    }
    let a=[];
    for(let i=0;i<list.length;++i) {
        a[i]=request[i];
    }
    return new Promise((resolve,reject)=>{
        Promise.all(a).then((e)=>{
            resolve(dictation);
        })
    });
}