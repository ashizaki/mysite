import React from "react"

export default function Home() {
  return (
    <div>
      <header className="header">
        <div className="container">
          <div className="site">
            <a href="index.html">
              <img src="/images/logo.svg" alt="ESSENTIALS" />
            </a>
          </div>
          <ul>
            <li>TOP</li>
            <li>ABOUT</li>
          </ul>
        </div>
      </header>

      <section className="hero">
        <img src="/images/hero.jpg" alt="" />
        <h1>
          There is no love sincerer that
          <br />
          the love of food.
        </h1>
      </section>

      <section className="food"></section>

      <section className="photo"></section>

      <footer className="footer">
        <div className="container">
          <ul className="sns">
            <li>
              <a href="https://twitter.com/">
                <i className="fab fa-twitter" />
                <span className="sr-only">Twitter</span>
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  )
}
