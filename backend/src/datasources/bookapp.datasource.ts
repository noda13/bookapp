import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'bookapp',
  connector: 'mysql',
  url: '',
  host: 'mysql',
  port: 3306,
  user: 'bmuser',
  password: 'myp@ssword',
  database: 'bookapp'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class BookappDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'bookapp';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.bookapp', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
