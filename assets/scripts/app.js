const ATTACK_VALUE = 10;

const MONSTER_ATTACK_VALUE = 21;

const STRONG_ATTACK_VALUE = 15;

const HEAL_VALUE = 20;

const modeAttack = 'attack';

const modeStrongAttack = 'strong_attack';

const LogEventPlayerAttack = 'player_attack';

const LogEventPlayerStrongAttack = 'player_strong_attack';

const LogEventMonsterAttack = 'monster_attack';

const LogEventPlayerHeal = 'player_heal';

const LogEventGameOver = 'game_over';

function getMaxLifeValue() {
  const enteredValue = prompt('Max life for you and the monster', '100');

  const parsedValue = parseInt(enteredValue);

  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw { message: 'Invalid user input not a number' };
  }
  return parsedValue;
}
let chosenMaxLife;

try {
  chosenMaxLife = getMaxLifeValue();
} catch (error) {
  console.log(error);
  chosenMaxLife = 100;
  alert('you entered a wrong value health set to 100');
}

let currentMonsterHealth = chosenMaxLife;

let currentPlayerHealth = chosenMaxLife;

let hasBonusLife = true;

let battleLog = [];

let lastLoggedEntry;

function writeToLog(event, value, monsterHealth, playerHealth) {
  let logEntry = {
    event: event,
    value: value,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };
  switch (event) {
    case LogEventPlayerAttack:
      logEntry.target = 'monster';
      break;
    case LogEventPlayerStrongAttack:
      logEntry.target = 'monster';
      break;
    case LogEventMonsterAttack:
      logEntry.target = 'player';
      break;
    case LogEventPlayerHeal:
      logEntry.target = 'player';
      break;

    case LogEventGameOver:
      break;
    default:
      logEntry = {};
  }
  // if (event === LogEventPlayerAttack) {
  //   logEntry = {
  //     event: event,
  //     value: value,
  //     target: 'monster',
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // } else if (event === LogEventPlayerStrongAttack) {
  //   logEntry = {
  //     event: event,
  //     value: value,
  //     target: 'monster',
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // } else if (event === LogEventMonsterAttack) {
  //   logEntry = {
  //     event: event,
  //     value: value,
  //     target: 'player',
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // } else if (event === LogEventPlayerHeal) {
  //   logEntry = {
  //     event: event,
  //     value: value,
  //     target: 'player',
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // } else if (event === LogEventGameOver) {
  //   logEntry = {
  //     event: event,
  //     value: value,
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // }
  battleLog.push(logEntry);
}

adjustHealthBars(chosenMaxLife);
function reset() {
  currentMonsterHealth = chosenMaxLife;

  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;

  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);

  currentPlayerHealth -= playerDamage;
  writeToLog(
    LogEventMonsterAttack,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    alert('you lucky bastard');
    setPlayerHealth(initialPlayerHealth);
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('you won');
    writeToLog(
      LogEventGameOver,
      'player won',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('you lost');
    writeToLog(
      LogEventGameOver,
      'player lost',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('you have a draw');
    writeToLog(
      LogEventGameOver,
      'Draw',
      currentMonsterHealth,
      currentPlayerHealth
    );
  }
  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackMonster(mode) {
  const maxDamage = mode === modeAttack ? ATTACK_VALUE : STRONG_ATTACK_VALUE;

  const logEvent =
    mode === modeAttack ? LogEventPlayerAttack : LogEventPlayerStrongAttack;

  // if (mode === modeAttack) {
  //   maxDamage = ATTACK_VALUE;
  //   logEvent = LogEventPlayerAttack;
  // } else if (mode === modeStrongAttack) {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logEvent = LogEventPlayerStrongAttack;
  // }

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function attackHandler() {
  attackMonster(modeAttack);
}

function strongAttackHandler() {
  attackMonster(modeStrongAttack);
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("overheal can't happen");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }

  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LogEventPlayerHeal,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function printLogHandler() {
  // for (let i = 0; i < 3; i++) {
  //   console.log('--------------');
  // }
  // let j = 0;
  // do {
  //   console.log(j);
  //   j++;
  // } while (j < 3);

  let index = 0;

  for (const logEntry of battleLog) {
    if (
      (!lastLoggedEntry && lastLoggedEntry !== 0) ||
      lastLoggedEntry < index
    ) {
      console.log(`#${index}`);

      for (const key in logEntry) {
        console.log(`${key} --> ${logEntry[key]}`);
      }
      lastLoggedEntry = index;
      break;
    }
    index++;
  }
}

attackBtn.addEventListener('click', attackHandler);

strongAttackBtn.addEventListener('click', strongAttackHandler);

healBtn.addEventListener('click', healPlayerHandler);

logBtn.addEventListener('click', printLogHandler);
