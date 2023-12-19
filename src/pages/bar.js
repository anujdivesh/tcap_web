import React, { useEffect, useRef, useState } from 'react';
import { Line ,Bar} from "react-chartjs-2"

var Bargraph = ({totalIncome,Balance,Expenses}) => {


const [state,setState] = useState({

    labels:["Total Income","Expenses","Current Balance"],
    datasets:[{

        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data:[totalIncome,Balance,Expenses]

    }]
})

useEffect(() => {
    setState({
        labels:["Total Income","Expenses","Current Balance"],
        datasets:[{
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data:[totalIncome,Balance,Expenses]
    
        }]
    })

}, [totalIncome,Balance,Expenses]);


    return ( 
<section className="chart mb-4 mt-lg-5">

<div className="container-lg">
    <div className="text-center">

        <h2>  Income , Expenses and Current Balance  </h2>
        <p className="lead"> Bar graph showing Total icnome , Expenses and remaining balance </p>
    
    </div>

<div className="row justify-content-center align-items-center mt-3 g-4">

<div className="col-md-5">

<Line data={state}
    
    options={{
            title:{
              display:true,
              text:'Income , Expenses and Current Balance',
              fontSize:20
            },
            legend:{
              display:true,
              position:'right'
            }
          }}

 />




</div>


<div className="col-md-5">

<Bar data={state}
    
    options={{
            title:{
              display:true,
              text:'Income , Expenses and Current Balance',
              fontSize:20
            },
            legend:{
              display:true,
              position:'right'
            }
          }}

 />



</div>
</div>




</div>

</section>

     );
}
 
export default Bargraph;