import dynamic from 'next/dynamic'

 const PlanckComponent = dynamic(() => import('../components/PlanckComponent'), {
  ssr: false,
})

  export default function IndexPage() {
   return (
     <div>
       <h1>Testing PixiJS &amp; Planck Physics</h1>
       <PlanckComponent />
       <pre>Using <a href="https://reactpixi.org">react-pixi</a> with NextJS and <a href="https://piqnt.com/planck.js/">Planck.js</a> physics engine.</pre>
     </div>
   )
 }
