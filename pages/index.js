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
       <h1>Testing Headding</h1>
       <PixiComponent />
       <PlanckComponent />
       <pre>This is really small text</pre>
     </div>
   )
 }
