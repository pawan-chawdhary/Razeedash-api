/**
 * Copyright 2020 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const BaseAuth = require('./auth_base');

module.exports = class DefaultAuth extends BaseAuth {

  constructor() {
    super({name: 'Default RBAC'});
  }
    
  rbac(action, type) {
    return async(req, res, next) => {
      const userId = req.get('x-user-id');
      const apiKey = req.get('x-api-key');
    
      req.log.debug({name: this._name, action, type, req_id: req.id}, 'rbac enter...');
    
      if (!userId || !apiKey) {
        res.status(401).send('x-user-id and x-api-key required');
        return;
      }
    
      const Users = req.db.collection('users');
      const user = await Users.findOne({ _id: userId, apiKey: apiKey });
    
      if (!user) {
        res.sendStatus(403);
        return;
      }
      next();
    };
  }
};