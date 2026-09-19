export interface GtfsAgency {
  agency_id: string;
  agency_name: string;
  agency_url: string;
  agency_timezone: string;
  agency_lang: string;
  agency_phone: string;
}

export interface GtfsRoute {
  route_id: string;
  agency_id: string;
  route_short_name: string;
  route_long_name: string;
  route_type: number; // 3 = Bus
  route_color: string;
  route_text_color: string;
}

export interface GtfsTrip {
  route_id: string;
  service_id: string;
  trip_id: string;
  trip_headsign: string;
  direction_id: number;
  wheelchair_accessible: number;
}

export interface GtfsStop {
  stop_id: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  zone_id: string;
}

export interface GtfsStopTime {
  trip_id: string;
  arrival_time: string; // HH:MM:SS
  departure_time: string; // HH:MM:SS
  stop_id: string;
  stop_sequence: number;
  stop_headsign?: string;
  pickup_type: number;
  drop_off_type: number;
}

export interface GtfsCalendar {
  service_id: string;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
  start_date: string; // YYYYMMDD
  end_date: string; // YYYYMMDD
}
