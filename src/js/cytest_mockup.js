/* globals ShapeManager: false */
/* globals console: false */

$(function() {
    var WIDTH = 512,
        HEIGHT = 512;

    var focus_areas = [];
    var answers = [];

    var options = {};

    var teacherShapeManager = new ShapeManager("teacherCanvas",
        WIDTH, HEIGHT, options);
    teacherShapeManager.setState("SELECT");

    var studentFAShapeManager = new ShapeManager("focusAreasCanvas",
        WIDTH, HEIGHT, options);
    studentFAShapeManager.setState("SELECT");

    var studentAShapeManager = new ShapeManager("answersCanvas",
        WIDTH, HEIGHT, options);
    studentAShapeManager.setState("SELECT");

    $("input[name='tstate']").click(function() {
        var state = $(this).val();
        teacherShapeManager.setState(state);
    });

    $("input[name='sstate']").click(function() {
        var state = $(this).val();
        studentAShapeManager.setState(state);
    });

    $("button[name='save-teacher-data']").click(function() {
        // Clear previously saved focus_areas and answers
        focus_areas = [];
        answers = [];

        var shapes_json = teacherShapeManager.getShapesJson();
        console.log(shapes_json);
        for (var x=0; x<shapes_json.length; x++) {
            if (shapes_json[x].type === "Rectangle") {
                focus_areas.push(shapes_json[x]);
            } else if (shapes_json[x].type === "Ellipse") {
                answers.push(shapes_json[x]);
            } else {
                console.warn("Problem with SHAPE " + shapes_json[x]);
            }
        }
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
        teacherShapeManager.deleteAll();
        console.log(focus_areas);
        teacherShapeManager.addShapesJson(focus_areas);
        console.log(answers);
        teacherShapeManager.addShapesJson(answers);
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