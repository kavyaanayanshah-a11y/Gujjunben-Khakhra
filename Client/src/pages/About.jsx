const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-orange-100 rounded-full mb-4">
            <span className="text-4xl">🫓</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-orange-800 mb-4">About Gujjuben Khakhra</h1>
          <p className="text-xl text-gray-600">Authentic Taste of Gujarat Since 1985</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-orange-700 mb-4">Our Story</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Gujjuben Khakhra started with a simple vision – to bring the authentic, crispy, and healthy khakhras from the heart of Gujarat to every home. For over three decades, we have perfected the art of making khakhras using traditional recipes passed down through generations.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our khakhras are hand-rolled, slow-roasted, and vacuum-packed to preserve freshness. We use only the finest whole wheat flour, pure spices, and natural ingredients – no preservatives, no artificial flavors.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-3xl mb-3">🥇</div>
            <h3 className="text-xl font-bold text-orange-700 mb-2">Quality First</h3>
            <p className="text-gray-600">We source the best ingredients and maintain strict quality standards at every step.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="text-xl font-bold text-orange-700 mb-2">Worldwide Shipping</h3>
            <p className="text-gray-600">Now you can enjoy Gujjuben Khakhra wherever you are – delivered fresh to your doorstep.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-3xl mb-3">💚</div>
            <h3 className="text-xl font-bold text-orange-700 mb-2">Healthy Snacking</h3>
            <p className="text-gray-600">Our khakhras are baked, not fried – a guilt-free snack for all ages.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-3xl mb-3">👩‍🍳</div>
            <h3 className="text-xl font-bold text-orange-700 mb-2">Traditional Recipe</h3>
            <p className="text-gray-600">Every khakhra is made with love, following a 40-year-old family recipe.</p>
          </div>
        </div>

        <div className="bg-orange-100 rounded-2xl p-8 text-center">
          <p className="text-lg italic text-orange-800">"Gujjuben’s khakhras bring back memories of my grandmother’s kitchen. Crispy, flavorful, and pure love in every bite."</p>
          <p className="mt-2 font-semibold">– A loyal customer</p>
        </div>
      </div>
    </div>
  )
}

export default About