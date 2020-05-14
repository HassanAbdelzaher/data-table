
import React from 'react'
import {DataTable} from '../src'
export const Sample=()=>{
    return <DataTable onDelete={(d)=>{alert(d?.length)}} data={[{x:'222',y:'wwwww'}]} columns={[{id:'x',label:'x',render:(v)=>{return <h1>{v}</h1>}}]} autoGenerateColumns={true}></DataTable>
}