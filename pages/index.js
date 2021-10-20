import dynamic from 'next/dynamic'

  const PixiComponent = dynamic(() => import('../components/PixiComponent'), {
   ssr: false,
 })

 const PlanckComponent = dynamic(() => import('../components/PlanckComponent'), {
  ssr: false,
})

  export default function IndexPage() {
   return (
     <div>
       <h1>Testing PixiJS &amp; Planck Physics</h1>
       <PixiComponent />
       <PlanckComponent />
       <pre>Using react-pixi with NextJS</pre>
     </div>
   )
 }
