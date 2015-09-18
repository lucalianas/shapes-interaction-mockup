/* globals ShapeManager: false */
/* globals console: false */

$(function() {
    var WIDTH = 512,
        HEIGHT = 512;

    var focus_areas = [];
    var answers = [];

    var options = {};

    var teacher_FAC_ID = "teacherFocusAreasCanvas";
    var teacher_AC_ID = "teacherAnswersCanvas";

    var teacherFAC = new ShapeManager(teacher_FAC_ID, WIDTH, HEIGHT, options);
    teacherFAC.setState("SELECT");

    var teacherAC = new ShapeManager(teacher_AC_ID, WIDTH, HEIGHT, options);
    teacherAC.setState("SELECT");

    var studentFAShapeManager = new ShapeManager("focusAreasCanvas",
        WIDTH, HEIGHT, options);
    studentFAShapeManager.setState("SELECT");

    var studentAShapeManager = new ShapeManager("answersCanvas",
        WIDTH, HEIGHT, options);
    studentAShapeManager.setState("SELECT");

    $("input[name='sstate']").click(function() {
        var state = $(this).val();
        studentAShapeManager.setState(state);
    });

    var moveBackground = function(panel_id) {
        $("#"+panel_id).removeClass("foreground");
        $("#"+panel_id).addClass("background");
    };

    var moveForeground = function(panel_id) {
        $("#"+panel_id).removeClass("background");
        $("#"+panel_id).addClass("foreground");
    };

    var activateButton = function(btn) {
        btn.addClass("btn-info");
        btn.removeClass("btn-default");
    };

    var deactivateButton = function(btn) {
        btn.addClass("btn-default");
        btn.removeClass("btn-info");
    };

    $("#btn-sel-farea").click(function() {
        console.log("Clicked SELECT SHAPE");
        moveForeground(teacher_FAC_ID);
        moveBackground(teacher_AC_ID);
        teacherFAC.setState("SELECT");
        deactivateButton($("button[name='tabuttons']"));
        activateButton($("#btn-sel-farea"));
        deactivateButton($("#btn-add-farea"));
        deactivateButton($("#btn-delete-farea"));
    });

    $("#btn-add-farea").click(function() {
        console.log("Clicked ADD RECT");
        moveForeground(teacher_FAC_ID);
        moveBackground(teacher_AC_ID);
        teacherFAC.setState("RECT");
        deactivateButton($("button[name='tabuttons']"));
        deactivateButton($("#btn-sel-farea"));
        activateButton($("#btn-add-farea"));
        deactivateButton($("#btn-delete-farea"));
    });

    $("#btn-delete-farea").click(function() {
        console.log("Clicked DELETE FOCUS AREAS");
        moveForeground(teacher_FAC_ID);
        moveBackground(teacher_AC_ID);
        teacherFAC.deleteAll();
        deactivateButton($("button[name='tabuttons']"));
        deactivateButton($("#btn-sel-farea"));
        deactivateButton($("#btn-add-farea"));
        activateButton($("#btn-delete-farea"));
    });

    $("#btn-sel-answer").click(function() {
        console.log("Clicked SELECT POINT");
        moveForeground(teacher_AC_ID);
        moveBackground(teacher_FAC_ID);
        teacherAC.setState("SELECT");
        deactivateButton($("button[name='tfabuttons']"));
        activateButton($("#btn-sel-answer"));
        deactivateButton($("#btn-add-answer"));
        deactivateButton($("#btn-delete-answer"));
    });

    $("#btn-add-answer").click(function() {
        console.log("Clicked ADD POINT");
        moveForeground(teacher_AC_ID);
        moveBackground(teacher_FAC_ID);
        teacherAC.setState("POINT");
        deactivateButton($("button[name='tfabuttons']"));
        deactivateButton($("#btn-sel-answer"));
        activateButton($("#btn-add-answer"));
        deactivateButton($("#btn-delete-answer"));
    });

    $("#btn-delete-answer").click(function() {
        console.log("Clicked DELETE ANSWERS");
        moveForeground(teacher_AC_ID);
        moveBackground(teacher_FAC_ID);
        teacherAC.deleteAll();
        deactivateButton($("button[name='tfabuttons']"));
        deactivateButton($("#btn-sel-answer"));
        deactivateButton($("#btn-add-answer"));
        activateButton($("#btn-delete-answer"));
    });

    $("button[name='save-teacher-data']").click(function() {
        focus_areas = teacherFAC.getShapesJson();
        answers = teacherAC.getShapesJson();

        console.log(focus_areas, answers);

        $("button[name='switch-panel']").prop('disabled', false);
    });

    $("button[name='switch-panel']").click(function() {
        if ($("#teacher-panel").hasClass("hidden")) {
            $("#student-panel").addClass("hidden");
            $("#teacher-panel").removeClass("hidden");
            $("button[name='switch-panel']").html("Switch to student panel");
            init_teacher_panel();
        } else {
            $("#teacher-panel").addClass("hidden");
            $("#student-panel").removeClass("hidden");
            $("button[name='switch-panel']").html("Switch to teacher panel");
            init_student_panel();
        }
    });

    var init_teacher_panel = function() {
        teacherFAC.deleteAll();
        teacherAC.deleteAll();
        console.log(focus_areas);
        teacherFAC.addShapesJson(focus_areas);
        console.log(answers);
        teacherAC.addShapesJson(answers);
    };

    var init_student_panel = function() {
        studentFAShapeManager.deleteAll();
        studentAShapeManager.deleteAll();
        studentFAShapeManager.addShapesJson(focus_areas);
    };

    var get_distance = function(point_1, point_2) {
        var distance = Math.sqrt(Math.pow(point_1.x - point_2.x, 2) +
                                 Math.pow(point_1.y - point_2.y, 2));
        return distance;
    };

    var check_answer = function(student_answer) {
        for (var x=0; x<answers.length; x++) {
            var p1 = {"x": student_answer.cx, "y": student_answer.cy};
            var p2 = {"x": answers[x].cx, "y": answers[x].cy};
            var dist = get_distance(p1, p2);
            if (dist <= answers[x].rx) {
                return "good";
            }
        }
        return "bad";
    };

    $("button[name='save-student-data']").click(function() {
        var student_answers = studentAShapeManager.getShapesJson();
        var results = {
            "good": 0,
            "bad": 0
        };
        for (var x=0; x<student_answers.length; x++) {
            results[check_answer(student_answers[x])] += 1;
        }

        console.log(results);
    });
});