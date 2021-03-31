import { AssignmentRules } from "../../models/assignmentRuleModel";

export async function ApplyRuleSets(session: any, obj: any): Promise<any | undefined> {
  try {
    // console.log(session);
    // console.log(obj);

    let rulesets = await AssignmentRules.getRuleSets(session.nsp)
    if (rulesets && rulesets.length) {
      // console.log('rulesets');
      // console.log(rulesets);


      let matched = new Array(rulesets.length).fill(0); //truthy value for rulesets if matched
      let votingArray = new Array(rulesets.length).fill(0); //number of successfull hits in match

      // let search: any = {};
      // search.$or = []
      // search.$and = []

      rulesets.map((ruleset, index) => {

        switch (ruleset.operator.toLowerCase()) {
          case 'or':

            ruleset.conditions.map(condition => {

              if ((obj as Object).hasOwnProperty(condition.key)) {
                // console.log('Condition Matched', obj[condition.key]);

                let result = (obj[condition.key] as string).match(new RegExp(condition.regex, 'gmi'))

                if (result && result.length) {

                  // console.log(result.length);
                  // console.log('Regex Matched', result);
                  votingArray[index] += result.length
                  matched[index] = true;
                }
              }

            })
            break;

          case 'and':
            let canMatch = true;
            ruleset.conditions.map(condition => {
              if (canMatch && (obj as Object).hasOwnProperty(condition.key)) {
                let result = (obj[condition.key] as string).match(new RegExp(condition.regex, 'gmi'))
                if (result && result.length) {
                  votingArray[index] += result.length
                  matched[index] = true;
                } else {
                  matched[index] = false;
                  canMatch = false;
                }
              }

            })
            break;

        }
      });


      //for returning ruleset that matches most conditions
      let RuleIndex = -1;
      let max = -1;

      matched.map((match, index) => {
        if (match && votingArray[index] > max) {
          RuleIndex = index;
          max = votingArray[index];
        }
      })
      let data: any = {};
      if (RuleIndex > -1) {
        // console.log(rulesets[RuleIndex].actions);

        rulesets[RuleIndex].actions.map(act => {
          // _id: { $nin: exclude }

          if (!data[act.value]) {
            data[act.value] = {};
            data[act.value]['$in'] = [];
            data[act.value]['$in'] = act.keywords
          }
          else if (data[act.value] && data[act.value]['$in']) data[act.value]['$in'] = data[act.value]['$in'].concat(act.keywords)

        })
      }
      // console.log(data);

      // if (RuleIndex > -1) return rulesets[RuleIndex];
      // else return undefined
      return data
    }
    else return undefined
  } catch (error) {
    console.log(error);
    console.log('error in Applying chat assignment RuleSets');
    return undefined;
  }
}