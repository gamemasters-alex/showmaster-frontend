import styles from './GuessYearQuestionTeam.scss';
import { useSelector } from 'react-redux';
import { selectCurrentQuestion, selectTeamScoredId } from '../../../../redux/gameSlice';

import Button from '../../Button/Button';
import React, { useState } from 'react';
import { Slider } from '@mui/material';

function GuessYearQuestionTeam() {
  const [winningScore, setWinningScore] = useState(1950);
  const { question } = useSelector(selectCurrentQuestion);

  function handleWinningScoreChange(event: any) {
    setWinningScore(event.target.value);
  }

  function handleSubmit(selectedYear: number) {
    // sendMessage('SaveSelectedYearInGuessYearGame', selectedYear, currentUser?.id);
    // TODO:create new WS event handler 'SaveSelectedYearInGuessYearGame(selectedYear, currentUser.id)' on server (.net app)
    //  Persist answer in database. Create new db structure if it doesn't exists. key-value -> userId-selectedYear
    //  Validate on server if it was answer of second team. ->
    //  If yes, load correct answer (year) from question,
    //  compare it with two answers of teams. Team which selected year which is closer to correct one -> should receive a POINT! already in that process
    //  As end flow, send to host information from server about team who clicked "SubmitButton" ->
    //  Create new WS event handler 'InformHostAboutSubmitActionInGuessYearGame(teamUserId)' on client (websocket slice)
    //  Handler should update indicator for given team on host screen (red indicator and text 'Submitted')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>{question && <span>{question.questionTitle}</span>}</div>
      <div className={styles.content}>
        <div className={`${styles.questionContent} ${question ? styles.displayContent : ''}`}>
          <span>{question.questionText}</span>
          <img src={question.imageUrl!}></img>
          <span>Select the year</span>
        </div>
        <span className={styles.values}>
          <span className={styles.value}>{winningScore}</span>
          <Slider
            onChange={handleWinningScoreChange}
            value={winningScore}
            aria-label="Winning score"
            valueLabelDisplay="off"
            step={1}
            marks
            min={1900}
            max={2024}
          />
        </span>
      </div>
      <div className={styles.footer}>
        {question && (
          <Button color="primary" onClick={handleSubmit(1990)}>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}

export default GuessYearQuestionTeam;
