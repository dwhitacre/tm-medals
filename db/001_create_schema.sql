create table Map(
  MapUid varchar not null primary key,
  AuthorTime int not null,
  Name varchar not null default '',
  Campaign varchar,
  CampaignIndex int,
  DateModified timestamp not null default (now() at time zone 'utc')
);

create table MedalTimes(
  Id serial primary key,
  MapUid varchar not null,
  MedalTime int not null default -1,
  CustomMedalTime int not null default -1,
  Reason varchar not null default '',
  DateModified timestamp not null default (now() at time zone 'utc'),
  foreign key(MapUid) references Map(MapUid)
);

create table Players(
  AccountId varchar not null primary key,
  Name varchar not null default '',
  DateModified timestamp not null default (now() at time zone 'utc')
);

create table Zones(
  ZoneId varchar not null primary key,
  Name varchar not null default '',
  DateModified timestamp not null default (now() at time zone 'utc')
);

create table PlayerMedalTimes(
  AccountId varchar not null primary key,
  MedalTimesId int not null,
  DateModified timestamp not null default (now() at time zone 'utc'),
  foreign key(MedalTimesId) references MedalTimes(Id),
  foreign key(AccountId) references Players(AccountId)
);

create table ZoneMedalTimes(
  ZoneId varchar not null primary key,
  MedalTimesId int not null,
  DateModified timestamp not null default (now() at time zone 'utc'),
  foreign key(MedalTimesId) references MedalTimes(Id),
  foreign key(ZoneId) references Zones(ZoneId)
);

---- create above / drop below ----

drop table ZoneMedalTimes;
drop table PlayerMedalTimes;
drop table Zones;
drop table Players;
drop table MedalTimes;
drop table Map;
