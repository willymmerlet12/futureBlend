import React, { useState } from "react";
import Template from "../img/exampleTemplate.png";
import { Link } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowUpFromBracket,
  faCircle,
  faUpload,
  faComputer,
  faImage,
  faSquarePollHorizontal,
  faLayerGroup,
  faSplotch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet";

library.add(
  faArrowUpFromBracket,
  faCircle,
  faUpload,
  faComputer,
  faImage,
  faSquarePollHorizontal,
  faLayerGroup,
  faSplotch,
  faUser
);

const Home = () => {
  const [authorizedUser, setAuthorizedUser] = useState(
    false || sessionStorage.getItem("accessToken")
  );

  return (
    <div className="App">
      <Helmet>
        ‍
        <title>
          Future Blend AI - Generate Realistic Images of Your Potential
          Offspring
        </title>
        <meta
          name="description"
          content="Visualize the Future: Generate Realistic Images of Your Potential
          Offspring with Future Blend AI."
        />
        <link rel="canonical" href="http://futureblendai.com/" />
      </Helmet>
      <>
        <section>
          <div className="text-section">
            <h3>
              Visualize the Future: Generate Realistic Images of Your Potential
              Offspring
            </h3>
            <p>
              Our innovative app allows you to upload photos of you and your
              partner to generate realistic and artistic images of your
              potential future children, offering a glimpse into what your
              family could look like.
            </p>

            <Link to="/generate">
              <button>Get started</button>
            </Link>
          </div>
          <div className="img-section">
            <img src={Template} alt="" />
          </div>
        </section>
        <section className="about">
          <h3>Why use our app?</h3>
          <h5>
            Visualize Your Future: Our app provides a unique opportunity to
            visualize and explore what your potential future children could look
            like. It adds an element of excitement and curiosity to your journey
            as a couple.
          </h5>
          <div className="wrap-info">
            <div className="info-about">
              <div className="icon">
                <span className="fa-2x">
                  <FontAwesomeIcon icon={faLayerGroup} className="highlight" />
                </span>
              </div>
              <h5>
                <b>Personalized Experience:</b> Our tool takes into account the
                unique characteristics of you and your partner, providing a
                personalized experience tailored specifically to your genetic
                combination. It offers a glimpse into the potential outcomes
                that reflect your individual traits and features.
              </h5>
            </div>
            <div className="info-about">
              <div className="icon">
                <span class="fa-2x">
                  <FontAwesomeIcon
                    icon={faArrowUpFromBracket}
                    className="highlight"
                  />
                </span>
              </div>
              <h5>
                <b>Shareable Results:</b> Once the images are generated, you
                have the option to share them with your friends, family, and
                social networks. It becomes a source of excitement and joy as
                you involve your loved ones in the process and gather their
                opinions and reactions.
              </h5>
            </div>
            <div className="info-about">
              <div className="icon">
                <span className="fa-2x">
                  <FontAwesomeIcon icon={faSplotch} className="highlight" />
                </span>
              </div>
              <h5>
                <b> Fun and Entertainment:</b> Our tool adds an element of fun
                and entertainment to your relationship journey. It allows you
                and your partner to engage in a playful exploration of your
                future possibilities and creates memorable moments of
                anticipation and excitement.
              </h5>
            </div>
            <div className="info-about">
              <div className="icon">
                <span className="fa-2x">
                  <FontAwesomeIcon icon={faUser} className="highlight" />
                </span>
              </div>
              <h5>
                <b> Self-Exploration:</b> Our tool isn't limited to couples.
                Even if you're single, you can still use it to explore and
                imagine the physical features of your future child. It's a fun
                way to reflect on your own genetic makeup and discover what
                traits you might pass on to future generations.
              </h5>
            </div>
          </div>
        </section>
        <section className="howitworks">
          <h3>How it works</h3>
          <div className="wrap-info">
            <div className="info-about">
              <div className="icon">
                <span className="fa-2x">
                  <FontAwesomeIcon icon={faUpload} className="highlight" />
                </span>
              </div>
              <h5>
                <b>Upload Your Photos:</b> Begin by uploading photos of yourself
                and your partner to our secure platform. These photos serve as
                the basis for generating the images of your future children.
              </h5>
            </div>
            <div className="info-about">
              <div className="icon">
                <span className="fa-2x">
                  <FontAwesomeIcon icon={faComputer} className="highlight" />
                </span>
              </div>
              <h5>
                <b>Advanced Algorithms:</b> Our app utilizes state-of-the-art
                image processing algorithms and artificial intelligence
                techniques to analyze the facial features, genetics, and other
                factors in the uploaded photos.
              </h5>
            </div>
            <div className="info-about">
              <div className="icon">
                <span className="fa-2x">
                  <FontAwesomeIcon icon={faImage} className="highlight" />
                </span>
              </div>
              <h5>
                <b>Image Generation:</b> Based on the information gathered from
                the uploaded photos, our app generates realistic and visually
                appealing images of your potential future children. These images
                aim to provide an estimation of their physical appearance.
              </h5>
            </div>
            <div className="info-about">
              <div className="icon">
                <span className="fa-2x">
                  <FontAwesomeIcon
                    icon={faSquarePollHorizontal}
                    className="highlight"
                  />
                </span>
              </div>
              <h5>
                <b>Explore the Results:</b> Once the image generation process is
                complete, you'll be able to explore the generated images and see
                the potential outcomes of your genetic combination. It's a
                fascinating way to spark conversations and ignite your
                imagination.
              </h5>
            </div>
          </div>
          <h5>
            Our tool offers an innovative and convenient solution for anyone
            curious about the potential physical appearance of their future
            child. With its user-friendly interface and advanced image
            generation technology, it provides a unique opportunity to envision
            and explore the possibilities of genetic inheritance. Whether you're
            in a relationship, single, or simply interested in the fascinating
            world of genetics, our app is a valuable tool for visualizing the
            future.
          </h5>
          <div className="start-button">
            <Link to="/generate">
              <button className="start">Start generating</button>
            </Link>
          </div>
        </section>
      </>
    </div>
  );
};

export default Home;
