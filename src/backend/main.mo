import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type ServiceReport = {
    reportNumber : Nat;
    engineerName : Text;
    date : Text;
    jobType : JobType;
    clientName : Text;
    location : Text;
    status : ReportStatus;
    assetId : Text;
    equipmentModel : Text;
    serialNumber : Text;
    faultDescription : Text;
    workPerformed : Text;
    partsUsed : [PartUsed];
    checklistItems : [ChecklistItem];
    remarks : Text;
  };

  type JobType = {
    #installation;
    #maintenance;
    #repair;
    #inspection;
    #emergency;
  };

  type ReportStatus = {
    #draft;
    #inProgress;
    #completed;
  };

  type PartUsed = {
    partName : Text;
    partNumber : Text;
    quantity : Nat;
  };

  type ChecklistItem = {
    item : Text;
    checked : Bool;
  };

  public type UserProfile = {
    name : Text;
  };

  module JobType {
    public func compare(jt1 : JobType, jt2 : JobType) : Order.Order {
      switch (jt1, jt2) {
        case (#installation, #installation) { #equal };
        case (#installation, _) { #less };
        case (#maintenance, #installation) { #greater };
        case (#maintenance, #maintenance) { #equal };
        case (#maintenance, _) { #less };
        case (#repair, #inspection) { #less };
        case (#repair, #repair) { #equal };
        case (#repair, #emergency) { #less };
        case (#inspection, #inspection) { #equal };
        case (#inspection, #emergency) { #less };
        case (#emergency, #emergency) { #equal };
        case (#emergency, _) { #greater };
      };
    };
  };

  module ReportStatus {
    public func compare(rs1 : ReportStatus, rs2 : ReportStatus) : Order.Order {
      switch (rs1, rs2) {
        case (#draft, #draft) { #equal };
        case (#draft, _) { #less };
        case (#inProgress, #draft) { #greater };
        case (#inProgress, #inProgress) { #equal };
        case (#inProgress, #completed) { #less };
        case (#completed, #completed) { #equal };
        case (#completed, _) { #greater };
      };
    };
  };

  module PartUsed {
    public func compare(pu1 : PartUsed, pu2 : PartUsed) : Order.Order {
      switch (Text.compare(pu1.partName, pu2.partName)) {
        case (#less) { #less };
        case (#greater) { #greater };
        case (#equal) {
          switch (Text.compare(pu1.partNumber, pu2.partNumber)) {
            case (#less) { #less };
            case (#greater) { #greater };
            case (#equal) { Nat.compare(pu1.quantity, pu2.quantity) };
          };
        };
      };
    };
  };

  module ChecklistItem {
    public func compare(ci1 : ChecklistItem, ci2 : ChecklistItem) : Order.Order {
      switch (Text.compare(ci1.item, ci2.item)) {
        case (#less) { #less };
        case (#greater) { #greater };
        case (#equal) {
          switch (ci1.checked, ci2.checked) {
            case (true, false) { #greater };
            case (false, true) { #less };
            case (_, _) { #equal };
          };
        };
      };
    };
  };

  module ServiceReport {
    public func compare(sr1 : ServiceReport, sr2 : ServiceReport) : Order.Order {
      Nat.compare(sr1.reportNumber, sr2.reportNumber);
    };

    public func compareByEngineerName(sr1 : ServiceReport, sr2 : ServiceReport) : Order.Order {
      Text.compare(sr1.engineerName, sr2.engineerName);
    };

    public func compareByClientName(sr1 : ServiceReport, sr2 : ServiceReport) : Order.Order {
      Text.compare(sr1.clientName, sr2.clientName);
    };
  };

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let reports = Map.empty<Nat, ServiceReport>();
  var nextReportNumber = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createReport(report : ServiceReport) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create reports");
    };

    let reportNumber = nextReportNumber;
    nextReportNumber += 1;

    let newReport : ServiceReport = {
      reportNumber;
      engineerName = report.engineerName;
      date = report.date;
      jobType = report.jobType;
      clientName = report.clientName;
      location = report.location;
      status = report.status;
      assetId = report.assetId;
      equipmentModel = report.equipmentModel;
      serialNumber = report.serialNumber;
      faultDescription = report.faultDescription;
      workPerformed = report.workPerformed;
      partsUsed = report.partsUsed.sort();
      checklistItems = report.checklistItems.sort();
      remarks = report.remarks;
    };

    reports.add(reportNumber, newReport);
    reportNumber;
  };

  public shared ({ caller }) func updateReport(reportNumber : Nat, updatedReport : ServiceReport) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update reports");
    };

    if (not reports.containsKey(reportNumber)) {
      Runtime.trap("Report not found");
    };

    let reportToUpdate : ServiceReport = {
      reportNumber;
      engineerName = updatedReport.engineerName;
      date = updatedReport.date;
      jobType = updatedReport.jobType;
      clientName = updatedReport.clientName;
      location = updatedReport.location;
      status = updatedReport.status;
      assetId = updatedReport.assetId;
      equipmentModel = updatedReport.equipmentModel;
      serialNumber = updatedReport.serialNumber;
      faultDescription = updatedReport.faultDescription;
      workPerformed = updatedReport.workPerformed;
      partsUsed = updatedReport.partsUsed.sort();
      checklistItems = updatedReport.checklistItems.sort();
      remarks = updatedReport.remarks;
    };

    reports.add(reportNumber, reportToUpdate);
  };

  public query ({ caller }) func getReportById(reportNumber : Nat) : async ?ServiceReport {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view reports");
    };
    reports.get(reportNumber);
  };

  public query ({ caller }) func getAllReports() : async [ServiceReport] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view reports");
    };
    reports.values().toArray().sort();
  };

  public query ({ caller }) func getReportsByEngineer(engineerName : Text) : async [ServiceReport] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view reports");
    };
    reports.values().toArray().sort(ServiceReport.compareByEngineerName).filter(
      func(report) { report.engineerName == engineerName }
    );
  };

  public shared ({ caller }) func deleteReport(reportNumber : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete reports");
    };

    if (not reports.containsKey(reportNumber)) {
      Runtime.trap("Report not found");
    };

    reports.remove(reportNumber);
  };
};
