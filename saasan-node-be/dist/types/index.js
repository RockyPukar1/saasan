"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportPriority = exports.ReportStatus = exports.PoliticianStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["CITIZEN"] = "citizen";
    UserRole["ADMIN"] = "admin";
    UserRole["MODERATOR"] = "moderator";
    UserRole["INVESTIGATOR"] = "investigator";
})(UserRole || (exports.UserRole = UserRole = {}));
var PoliticianStatus;
(function (PoliticianStatus) {
    PoliticianStatus["ACTIVE"] = "active";
    PoliticianStatus["INACTIVE"] = "inactive";
    PoliticianStatus["DECEASED"] = "deceased";
})(PoliticianStatus || (exports.PoliticianStatus = PoliticianStatus = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["SUBMITTED"] = "submitted";
    ReportStatus["UNDER_REVIEW"] = "under_review";
    ReportStatus["VERIFIED"] = "verified";
    ReportStatus["RESOLVED"] = "resolved";
    ReportStatus["DISMISSED"] = "dismissed";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
var ReportPriority;
(function (ReportPriority) {
    ReportPriority["LOW"] = "low";
    ReportPriority["MEDIUM"] = "medium";
    ReportPriority["HIGH"] = "high";
    ReportPriority["URGENT"] = "urgent";
})(ReportPriority || (exports.ReportPriority = ReportPriority = {}));
