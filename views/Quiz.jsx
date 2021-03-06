import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Constants from 'expo-constants';

import { Container } from '../components/global/Container';
import { QuizButton } from '../components/quiz/QuizButton';
import { QuizFlipCard } from '../components/quiz/QuizFlipCard';

const Quiz = ({ navigation, route }) => {
  const [correct, setCorrect] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { deckName } = route.params;
  const flipCard = useRef(null);
  const questions = useSelector((state) => state.decks[deckName].questions);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const maxQuestions = questions.length;

  const incrementCorrect = () => setCorrect((oldCorrect) => oldCorrect + 1);
  const incrementCurrent = () => setCurrentQuestion((oldCurrent) => oldCurrent + 1);
  const handleCorrect = () => {
    if (currentQuestion < maxQuestions) {
      incrementCorrect();
      incrementCurrent();
    }
  };
  const handleIncorrect = () => {
    if (currentQuestion < maxQuestions) incrementCurrent();
  };
  const handleFlip = () => {
    flipCard.current.flip();
    setIsFlipped((oldFlipped) => !oldFlipped);
  };
  useEffect(() => {
    if (!(currentQuestion < maxQuestions))
      navigation.navigate('Cards', { deckName, maxQuestions, correct, quizFinished: true });
  }, [currentQuestion, maxQuestions]);

  return (
    <Container>
      <View style={styles.statusBar} />
      <View style={styles.buttonWrapper}>
        <QuizButton
          mode="text"
          icon="door-open"
          onPress={() =>
            navigation.navigate('Cards', { deckName, cards: questions.length, quizFinished: false })
          }>
          Quit Quiz
        </QuizButton>
        <QuizButton mode="text" icon="sync" onPress={handleFlip}>
          {isFlipped ? 'View Question' : 'View Answer'}
        </QuizButton>
      </View>
      {currentQuestion < maxQuestions ? (
        <QuizFlipCard
          flipCard={flipCard}
          currentQuestion={currentQuestion}
          maxQuestions={maxQuestions}
          questions={questions}
        />
      ) : (
        <View style={styles.placeholder} />
      )}
      <View style={styles.buttonWrapper}>
        <QuizButton mode="contained" icon="close" onPress={handleIncorrect}>
          Incorrect
        </QuizButton>
        <QuizButton mode="contained" icon="check" onPress={handleCorrect}>
          Correct
        </QuizButton>
      </View>
    </Container>
  );
};

export default Quiz;

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
  },
  statusBar: { height: Constants.statusBarHeight },
  buttonWrapper: {
    flexDirection: 'row',
    margin: 10,
    flexShrink: 0,
  },
});
