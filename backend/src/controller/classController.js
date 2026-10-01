const classModel = require('../models/classModel');
const classMemberShipModel = require('../models/classMembershipModel')
const { generateJoinCode } = require('../utils/generateJoinCode')


const createClass = async (req, res) => {

    try {
        const { className } = req.body;
        const teacherId = req.user?._id || req.user?.id || req.body.teacherId;


        if (!className || !teacherId) {
            return res.status(400).json({
                success: false,
                message: "ClassName And Teacher Id is required"
            })
        }

        const code = await generateJoinCode();

        const classData = await classModel.create({
            className: className.trim(),
            teacherId,
            joinCode: code

        })
        res.status(201).json({
            success: true,
            message: "Class Created Successfully",
            data: classData,
        })
    }
    catch (err) {
        console.error("Create class error:", err);
        res.status(500).json(
            {
                success: false,
                message: "Internal Server Error",
                error: err.message,
            }
        )

    }
}

const joinClass = async (req, res) => {
    try {
        const { joinCode } = req.body;
        const  studentId  = req.user?._id || req.user?.id || req.body.studentId

        if (!joinCode) {
            return res.status(400).json({
                success: false,
                message: "Enter Join Code",
            });
        }

        const targetedClass = await classModel.findOne({
            joinCode: joinCode.trim().toUpperCase(),
        })
        if (!targetedClass) {
            return res.status(500).json({
                success: false,
                message: "No class Match with this Code",
            })
        }
        const alreadyJoined = await classMemberShipModel.findOne({
            studentId,
            classId: targetedClass._id,
        })

        if (alreadyJoined) {
            return res.status(400).json({
                success: false,
                message: "Already Joined",
            });
        }
        const membership = await classMemberShipModel.create({
            studentId,
            classId: targetedClass._id,
        });
        return res.status(200).json({
            success: true,
            message: `${targetedClass.className} class joined successfully!`,
            data: membership,
        });
    }
    catch (error) {
        console.error("Join Class Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

const getMyClass = async(req,res)=> {
    try{
        

    }
    catch(err){

    }
}


const getJoinedClass = async(req,res)=> {
    try{

    }
    catch(err){
        
    }
}

module.exports = {
    createClass,
    joinClass,
    getMyClass,
    getJoinedClass
}