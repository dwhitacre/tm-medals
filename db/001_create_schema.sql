create table Map(
  MapUid varchar not null primary key,
  AuthorTime int not null,
  Name varchar not null default '',
  Campaign varchar,
  CampaignIndex int
);

create table MedalTimes(
  Id serial primary key,
  MapUid varchar not null,
  MedalTime int not null default -1,
  CustomMedalTime int not null default -1,
  Reason varchar not null default '',
  foreign key(MapUid) references Map(MapUid)
);

create table PlayerMedalTimes(
  AccountId varchar not null primary key,
  MedalTimesId int not null,
  foreign key(MedalTimesId) references MedalTimes(Id)
);

create table ZoneMedalTimes(
  ZoneId varchar not null primary key,
  MedalTimesId int not null,
  foreign key(MedalTimesId) references MedalTimes(Id)
);

---- create above / drop below ----

drop table ZoneMedalTimes;
drop table PlayerMedalTimes;
drop table MedalTimes;
drop table Map;
