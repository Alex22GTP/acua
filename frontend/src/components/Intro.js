import React from "react";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background: linear-gradient(to right, #1d3557, #457b9d);
  color: white;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin-bottom: 1.5rem;
`;

const SearchBar = styled.input`
  width: 300px;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  text-align: center;
  outline: none;
`;

const CarouselSection = styled.div`
  width: 100%;
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const CarouselContainer = styled.div`
  width: 80%;
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  border-radius: 50%;

  &:hover {
    opacity: 1;
  }
`;

const images = [
  "https://via.placeholder.com/120",
  "https://via.placeholder.com/120",
  "https://via.placeholder.com/120",
  "https://via.placeholder.com/120",
  "https://via.placeholder.com/120"
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  centerMode: true,
};

function IntroSection() {
  return (
    <div>
      <IntroContainer>
        <Title>Secrufy</Title>
        <Subtitle>
          Conoce las categorías diseñadas para situaciones realistas en las cuales tendrás que pensar y actuar.
        </Subtitle>
        <SearchBar type="text" placeholder="Buscar..." />
      </IntroContainer>
      
      <CarouselSection>
        <CarouselContainer>
          <Slider {...settings}>
            {images.map((src, index) => (
              <ImageContainer key={index}>
                <Image src={src} alt={`Imagen ${index + 1}`} />
                <Overlay>Imagen {index + 1}</Overlay>
              </ImageContainer>
            ))}
          </Slider>
        </CarouselContainer>

        <CarouselContainer>
          <Slider {...settings}>
            {images.map((src, index) => (
              <ImageContainer key={index}>
                <Image src={src} alt={`Imagen ${index + 6}`} />
                <Overlay>Imagen {index + 6}</Overlay>
              </ImageContainer>
            ))}
          </Slider>
        </CarouselContainer>
      </CarouselSection>
    </div>
  );
}

export default IntroSection;
