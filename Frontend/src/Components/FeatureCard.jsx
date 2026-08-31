
const FeatureCard = ({icon:Icon, iconColor,bgColor, heading,para}) => {
  return (
    <>
    
    <div className='bg-paper-raised border border-line rounded-2xl p-4 hover:translate-y-2 transition ease-in'>
       <div className={`w-10 h-10 rounded-xl ${bgColor}  flex items-center justify-center mb-4`}>
        <Icon className={iconColor} size={20} />
      </div>
      <h1 className='text-ink font-display text-[18px] font-semibold pt-2'>{heading}</h1>
      <p className='pt-4 pb-2 font-sans text-sm  text-ink-soft'>{para}</p>
    </div>
    
    
    </>
  )
}

export default FeatureCard