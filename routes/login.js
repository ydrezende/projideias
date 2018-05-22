const express = require('express');
const userClass = require('../classes/user');
const router = express.Router();
const bodyParser = require('body-parser');

// Primeiro passo da autenticação em duas etapas - CHECANDO EMAIL
router.post('/CheckEmail',
  bodyParser.urlencoded({extended: false}),
  function (req, res) {
    userClass.userExists(req.body.email, function(err, result) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      if(result.length > 0) {
        resContent = {
          emailToken : require('crypto').randomBytes(8).toString('hex')
        };
        userClass.storeEmailToken(resContent.emailToken, req.body.email, function(err, result) {
          if(err) {
            console.log(err);
            res.sendStatus(500);
            return;
          }
          if(result.changedRows > 0) {
            res.send(resContent);
          }
        });
      } else res.sendStatus(404);
    });
});

// Segundo passo da autenticação em duas etapas - CHECANDO TOKEN E SENHA
router.post('/Login',
  bodyParser.urlencoded({extended: false}),
  function (req, res) {
    userClass.authEmailToken(req.body.emailToken, passwordCheck);
});

function passwordCheck(err, result) {
  if (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
  if(result.length > 0) {
    userClass.authPassword(req.body.senha, result[0].senha, finishAuthentication);
  } else res.sendStatus(401);
}

function finishAuthentication(err, result) {
  if (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
  if(result) {
    resContent = {
      token : require('crypto').randomBytes(16).toString('hex')
    };
    userClass.storeToken(resContent.token, req.body.emailToken, function(err, result) {
      if(err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      if(result.changedRows > 0) {
        res.send(resContent);
      } else res.sendStatus(500); 
    });
  } else res.sendStatus(401);
}

module.exports = router;