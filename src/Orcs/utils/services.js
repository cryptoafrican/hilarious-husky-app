
import { db } from "../initFirebase";
import { getDatabase, ref, set, onValue, query, get,child, equalTo, orderByValue, push, orderByChild, limitToLast} from "firebase/database";

export const updateDatabase = async (orc) => {
      
    const orcDataref = ref(db, 'etherorcs/orcs/' + orc.tokenid)
    
      await set(orcDataref, {
        owner: orc.owner.toLowerCase(),
        action: orc.action,
        actionString: orc.actionString,
        tokenid: parseInt(orc.tokenid),
        claimable: orc.claimable,
        level: parseInt(orc.level),
        calcLevel: parseFloat(orc.calcLevel),
        time: orc.time,
        body: orc.body,
        helm: orc.helm,
        mainhand: orc.mainhand,
        offhand: orc.offhand,
        totalZug: (4 + parseInt(orc.zugModifier)),
        attributes: orc.attributes
  
      });   

      console.log(`Updated Orc #${orc.tokenid} metadats`)
  
  }

export const getMyOrcsObject = async (address) => {
  
  const myOrcQuery = query(ref(db, 'orcs'), orderByChild('owner'), equalTo(address.toLowerCase())) ///"0x25aBa46Dcb360902Ab8CA72cA8528F1da1D903d8"));
  console.log("2.", address, "3.", myOrcQuery)    

  let dataArry = []
    let tokenArr = []
    let status = []
  
    onValue(myOrcQuery, (snapshot) =>{
      if(snapshot.exists()){
        

        Object.entries(snapshot.val()).forEach(([key, value])=>{
        
          dataArry.push({tokenId:value.tokenid, claimable:value.claimable, action:value.action})         
          tokenArr.push(value.tokenid)      
        })
     
        status.push(`Found ${tokenArr.length} Orc(s) for ${address}... Loading!`)
        console.log("Found Orcs. Orc of them", address, dataArry, "Orcs held:", tokenArr)   
      
      }else{
        console.log("Got No Orcs. NOrc of them", address) 
        status.push(`Found not Orcs try looking them up to force a metadata refresh.`)
      }
      
            
            }, {onlyOnce: true}
            )
           
           
            
           return({orcs: dataArry, tokens:tokenArr, status: status} ) 
    
    };
    

export const getOrcfromDb = async () => {

const OrcDisplayRef = query(ref(db, 'orcs'), limitToLast(100));
let obj

    onValue(OrcDisplayRef, (snapshot) =>{

        obj = snapshot.val();
        
         
       })
       
  return(obj)
  }